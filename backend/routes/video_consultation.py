import os
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Appointment, NotificationType, User
from utils.notifications import create_notification

router = APIRouter()


@router.post("/generate-link")
def generate_video_link(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment_id = payload.get("appointment_id")
    if not appointment_id:
        raise HTTPException(status_code=400, detail="appointment_id is required")

    appointment = db.query(Appointment).filter(Appointment.id == int(appointment_id)).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    role = str(current_user.role).lower()
    is_admin = role.endswith("admin")
    is_owner = appointment.user_id == current_user.id
    is_assigned_doctor = appointment.doctor_id == current_user.id
    if not (is_admin or is_owner or is_assigned_doctor):
        raise HTTPException(status_code=403, detail="Not allowed to generate video link for this appointment")

    jitsi_domain = os.getenv("JITSI_DOMAIN", "https://meet.jit.si").rstrip("/")
    room_token = secrets.token_hex(4)
    room_name = f"ladenutricare-apt-{appointment.id}-{room_token}"
    video_link = f"{jitsi_domain}/{room_name}"

    appointment.video_link = video_link

    create_notification(
        db=db,
        user_id=appointment.user_id,
        notification_type=NotificationType.APPOINTMENT,
        title="Video Consultation Ready",
        message=f"Video consultation link for appointment #{appointment.id} is now available.",
        link=f"/appointments/{appointment.id}",
    )

    if appointment.doctor_id:
        create_notification(
            db=db,
            user_id=appointment.doctor_id,
            notification_type=NotificationType.APPOINTMENT,
            title="Video Consultation Ready",
            message=f"Video consultation link for appointment #{appointment.id} is now available.",
            link="/doctor-dashboard",
        )

    db.commit()
    db.refresh(appointment)

    return {"video_link": video_link}
