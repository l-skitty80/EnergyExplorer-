# Emergent Google Auth testing playbook

## Flow

1. Login redirects to `https://auth.emergentagent.com/?redirect=<current-origin>/` using `window.location.origin`; never hardcode a host or fallback.
2. Emergent returns to the same origin with `#session_id=<temporary-id>`.
3. The frontend detects `session_id` synchronously from `useLocation().hash` and renders a callback processor.
4. The backend exchanges the ID with `https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data` using `X-Session-ID`.
5. The backend stores the returned session token in `user_sessions`, upserts a custom-UUID user in `users`, and sets an httpOnly `session_token` cookie (`secure`, `samesite=none`, `path=/`, seven-day expiry).
6. Frontend verifies sessions through `/api/auth/me`; logout calls `/api/auth/logout` and clears the query/session cache.

## Required checks

- `GET /api/auth/me` returns the current user with a cookie or Authorization bearer fallback.
- OAuth callback consumes the URL fragment once, removes it, and does not loop under React StrictMode.
- Protected UI never renders while auth is still checking.
- Logout clears the server session and returns the UI to the signed-out state.
- Mongo queries use custom `user_id` values and exclude `_id` from response projections.
- Datetimes are compared as UTC-aware values.

## Test identity tracking

Record allowed Google test identities, linked app users, and any roles in `memory/test_credentials.md`. Do not store Google passwords.

## Cleanup

Remove temporary test users and sessions from Mongo after verification. Do not commit session tokens.