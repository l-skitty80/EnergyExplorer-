import os
import uuid
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Cookie, Header, HTTPException, Response, status
from pymongo import ReturnDocument

from lib.db import db
from models.auth import EmergentSessionData, SessionExchangeRequest, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])
SESSION_COOKIE = "session_token"
SESSION_DAYS = 7
SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def as_aware_utc(value: datetime | str) -> datetime:
    parsed = datetime.fromisoformat(value) if isinstance(value, str) else value
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)


def bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    return token.strip() if scheme.lower() == "bearer" and token.strip() else None


async def current_user_for_token(token: str | None) -> UserPublic:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session not found")
    if as_aware_utc(session["expires_at"]) <= utc_now():
        await db.user_sessions.delete_one({"session_token": token})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return UserPublic.model_validate(user)


async def get_current_user(session_token: str | None, authorization: str | None) -> UserPublic:
    return await current_user_for_token(session_token or bearer_token(authorization))


@router.post("/session", response_model=UserPublic)
async def create_session(input: SessionExchangeRequest, response: Response):
    """Exchange Emergent's one-use fragment ID on the server, then set an httpOnly cookie."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            upstream = await client.get(SESSION_DATA_URL, headers={"X-Session-ID": input.session_id})
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Authentication service unavailable") from exc
    if upstream.is_error:
        raise HTTPException(status_code=401, detail="Unable to exchange authentication session")
    try:
        session_data = EmergentSessionData.model_validate(upstream.json())
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Invalid authentication response") from exc

    now = utc_now()
    user = await db.users.find_one_and_update(
        {"email": session_data.email},
        {"$set": {"name": session_data.name, "picture": session_data.picture, "updated_at": now}, "$setOnInsert": {"user_id": f"user_{uuid.uuid4().hex[:12]}", "email": session_data.email, "created_at": now}},
        projection={"_id": 0},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    if not user:
        raise HTTPException(status_code=500, detail="Unable to create user")
    await db.user_sessions.delete_many({"user_id": user["user_id"]})
    await db.user_sessions.insert_one({"user_id": user["user_id"], "session_token": session_data.session_token, "expires_at": now + timedelta(days=SESSION_DAYS), "created_at": now})
    response.set_cookie(SESSION_COOKIE, session_data.session_token, max_age=SESSION_DAYS * 24 * 60 * 60, httponly=True, secure=True, samesite="none", path="/")
    return UserPublic.model_validate(user)


@router.get("/me", response_model=UserPublic)
async def me(session_token: str | None = Cookie(default=None), authorization: str | None = Header(default=None)):
    return await get_current_user(session_token, authorization)


@router.post("/logout", status_code=204)
async def logout(response: Response, session_token: str | None = Cookie(default=None), authorization: str | None = Header(default=None)):
    token = session_token or bearer_token(authorization)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie(SESSION_COOKIE, path="/")
    response.status_code = 204
    return response