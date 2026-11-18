import logging
import os
from datetime import datetime, timedelta
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db
from dependencies import ALGORITHM, SECRET_KEY, get_current_user
from models import Appointment, AppointmentStatus, GoogleMeetCredential, NotificationType, PaymentStatus, User
from services.google_meet import (
    GOOGLE_MEET_SCOPE,
    create_google_meet,
    encrypt_refresh_token,
    google_oauth_client_config,
)
from utils.notifications import create_notification

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_doctor(user: User) -> None:
    if not str(user.role).lower().endswith("doctor"):
        raise HTTPException(status_code=403, detail="Only doctors can manage Google Meet")


def _google_flow(state: str | None = None):
    from google_auth_oauthlib.flow import Flow

    client_config = google_oauth_client_config()
    redirect_uri = client_config["web"]["redirect_uris"][0]
    flow = Flow.from_client_config(
        client_config,
        scopes=["openid", "email", GOOGLE_MEET_SCOPE],
        state=state,
    )
    flow.redirect_uri = redirect_uri
    return flow


@router.get("/google/status")
def google_meet_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _require_doctor(current_user)
    connected = db.query(GoogleMeetCredential).filter(
        GoogleMeetCredential.doctor_id == current_user.id
    ).first() is not None
    return {"connected": connected}


@router.post("/google/connect-url")
def google_meet_connect_url(current_user: User = Depends(get_current_user)):
    _require_doctor(current_user)
    state = jwt.encode(
        {
            "sub": str(current_user.id),
            "purpose": "google_meet_connect",
            "exp": datetime.utcnow() + timedelta(minutes=10),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    flow = _google_flow(state)
    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent select_account",
    )
    return {"authorization_url": authorization_url}


@router.get("/google/callback")
def google_meet_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    if error or not code or not state:
        return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'failed'})}")
    try:
        claims = jwt.decode(state, SECRET_KEY, algorithms=[ALGORITHM])
        if claims.get("purpose") != "google_meet_connect":
            raise JWTError("Invalid OAuth state")
        doctor_id = int(claims["sub"])
        doctor = db.query(User).filter(User.id == doctor_id).first()
        if not doctor or not str(doctor.role).lower().endswith("doctor"):
            raise JWTError("Doctor account not found")

        flow = _google_flow(state)
        flow.fetch_token(code=code)
        refresh_token = flow.credentials.refresh_token
        existing = db.query(GoogleMeetCredential).filter(
            GoogleMeetCredential.doctor_id == doctor_id
        ).first()
        if not refresh_token and existing:
            return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'connected'})}")
        if not refresh_token:
            return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'failed'})}")

        encrypted_token = encrypt_refresh_token(refresh_token)
        if existing:
            existing.encrypted_refresh_token = encrypted_token
        else:
            db.add(GoogleMeetCredential(
                doctor_id=doctor_id,
                encrypted_refresh_token=encrypted_token,
            ))
        db.commit()
        return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'connected'})}")
    except (JWTError, ValueError, HTTPException):
        db.rollback()
        logger.exception("Google Meet account connection failed")
        return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'failed'})}")
    except Exception:
        db.rollback()
        logger.exception("Google Meet OAuth callback failed")
        return RedirectResponse(f"{frontend_url}/doctor-dashboard?{urlencode({'google_meet': 'failed'})}")


@router.post("/generate-link")
def generate_video_link(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_doctor(current_user)
    try:
        appointment_id = int(payload.get("appointment_id"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="A valid appointment_id is required")

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Assigned appointment not found")
    if appointment.status != AppointmentStatus.APPROVED or appointment.payment_status != PaymentStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Google Meet is available after admin approval and patient payment")
    if appointment.consultation_format != "google_meet":
        raise HTTPException(status_code=400, detail="This appointment is not scheduled as a Google Meet consultation")
    if appointment.video_link and appointment.video_link.startswith("https://meet.google.com/"):
        return {"video_link": appointment.video_link}

    credential = db.query(GoogleMeetCredential).filter(
        GoogleMeetCredential.doctor_id == current_user.id
    ).first()
    if not credential:
        raise HTTPException(status_code=409, detail="Connect your Google account before creating a meeting")

    from services.google_meet import decrypt_refresh_token

    video_link = create_google_meet(decrypt_refresh_token(credential.encrypted_refresh_token))
    appointment.video_link = video_link
    create_notification(
        db=db,
        user_id=appointment.user_id,
        notification_type=NotificationType.APPOINTMENT,
        title="Google Meet Ready",
        message=f"Dr. {current_user.name} created the Google Meet link for your appointment.",
        link=f"/appointments/{appointment.id}",
    )
    db.commit()
    return {"video_link": video_link}
