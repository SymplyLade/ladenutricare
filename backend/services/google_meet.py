import base64
import hashlib
import os

from cryptography.fernet import Fernet, InvalidToken
from fastapi import HTTPException

GOOGLE_MEET_SCOPE = "https://www.googleapis.com/auth/meetings.space.created"
GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token"


def _fernet() -> Fernet:
    secret = os.getenv("GOOGLE_TOKEN_ENCRYPTION_KEY") or os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("Set GOOGLE_TOKEN_ENCRYPTION_KEY or JWT_SECRET to encrypt Google tokens")
    key = base64.urlsafe_b64encode(hashlib.sha256(secret.encode("utf-8")).digest())
    return Fernet(key)


def encrypt_refresh_token(token: str) -> str:
    return _fernet().encrypt(token.encode("utf-8")).decode("ascii")


def decrypt_refresh_token(token: str) -> str:
    try:
        return _fernet().decrypt(token.encode("ascii")).decode("utf-8")
    except (InvalidToken, ValueError) as exc:
        raise HTTPException(status_code=503, detail="Google account token cannot be decrypted; reconnect Google") from exc


def google_oauth_client_config() -> dict:
    client_id = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
    redirect_uri = os.getenv(
        "GOOGLE_OAUTH_REDIRECT_URI",
        "http://localhost:8000/api/video/google/callback",
    )
    if not client_id or not client_secret:
        raise HTTPException(status_code=503, detail="Google Meet is not configured on this server")
    return {
        "web": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": GOOGLE_TOKEN_URI,
            "redirect_uris": [redirect_uri],
        }
    }


def create_google_meet(refresh_token: str) -> str:
    from google.auth.transport.requests import AuthorizedSession, Request
    from google.oauth2.credentials import Credentials
    import requests

    config = google_oauth_client_config()["web"]
    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri=GOOGLE_TOKEN_URI,
        client_id=config["client_id"],
        client_secret=config["client_secret"],
        scopes=[GOOGLE_MEET_SCOPE],
    )
    try:
        credentials.refresh(Request())
        response = AuthorizedSession(credentials).post(
            "https://meet.googleapis.com/v2/spaces",
            json={},
            timeout=20,
        )
        response.raise_for_status()
        meeting_uri = response.json().get("meetingUri")
        if not meeting_uri:
            raise RuntimeError("Google Meet did not return a meeting URI")
        return meeting_uri
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail="Google Meet could not create a meeting. Reconnect Google and try again.",
        ) from exc
    except Exception as exc:
        if isinstance(exc, HTTPException):
            raise
        raise HTTPException(
            status_code=502,
            detail="Google Meet could not create a meeting. Reconnect Google and try again.",
        ) from exc
