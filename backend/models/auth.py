from datetime import datetime

from pydantic import BaseModel, Field


class UserPublic(BaseModel):
    user_id: str
    email: str
    name: str
    picture: str | None = None


class SessionExchangeRequest(BaseModel):
    session_id: str = Field(min_length=1)


class EmergentSessionData(BaseModel):
    id: str
    email: str
    name: str
    picture: str | None = None
    session_token: str


class UserDocument(UserPublic):
    created_at: datetime
    updated_at: datetime