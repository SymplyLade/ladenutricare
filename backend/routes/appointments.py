from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Appointment, AppointmentStatus, Doctor, NotificationType, User, UserRole
from schemas import AppointmentCreate, AppointmentResponse
from dependencies import get_current_user
from utils.notifications import create_notification

router = APIRouter()
FIXED_CONSULTATION_FEE = 10000.0
CONSULTATION_FORMATS = {"google_meet", "phone", "in_person"}


@router.get("", response_model=List[AppointmentResponse])
@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointments = db.query(Appointment).filter(Appointment.user_id == current_user.id).all()
    return appointments


@router.post("", response_model=AppointmentResponse)
@router.post("/", response_model=AppointmentResponse)
def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doctor = db.query(User).filter(User.id == appointment_data.doctor_id).first()
    if not doctor or not str(doctor.role).lower().endswith("doctor"):
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor.id).first()
    if not doctor_profile:
        raise HTTPException(status_code=400, detail="Doctor profile not found")
    if not doctor_profile.is_verified:
        raise HTTPException(status_code=400, detail="Doctor is not verified yet")
    consultation_format = str(appointment_data.consultation_format or "google_meet").strip().lower()
    if consultation_format not in CONSULTATION_FORMATS:
        raise HTTPException(status_code=400, detail="Choose Google Meet, phone, or in-person consultation")

    new_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        consultation_format=consultation_format,
        department=appointment_data.department,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        consultation_fee=FIXED_CONSULTATION_FEE,
        notes=appointment_data.notes,
    )
    db.add(new_appointment)
    db.flush()

    create_notification(
        db=db,
        user_id=doctor.id,
        notification_type=NotificationType.APPOINTMENT,
        title="New Appointment Request",
        message=f"{current_user.name} booked an appointment on {appointment_data.appointment_date} at {appointment_data.appointment_time}.",
        link="/doctor-dashboard",
    )

    db.commit()
    db.refresh(new_appointment)

    return new_appointment


@router.get("/doctor")
def get_doctor_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not str(current_user.role).lower().endswith("doctor"):
        raise HTTPException(status_code=403, detail="Only doctors can access this resource")

    appointments = (
        db.query(Appointment)
        .filter(Appointment.doctor_id == current_user.id)
        .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        .all()
    )

    return [
        {
            "id": appointment.id,
            "patient_name": appointment.user.name if appointment.user else "Unknown",
            "department": appointment.department,
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "status": str(appointment.status).split(".")[-1].lower(),
            "payment_status": str(appointment.payment_status).split(".")[-1].lower(),
            "video_link": appointment.video_link,
            "consultation_format": appointment.consultation_format,
            "notes": appointment.notes,
        }
        for appointment in appointments
    ]


@router.patch("/doctor/{appointment_id}/availability")
def respond_to_appointment_availability(
    appointment_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not str(current_user.role).lower().endswith("doctor"):
        raise HTTPException(status_code=403, detail="Only doctors can respond to appointment requests")
    if "available" not in payload or not isinstance(payload["available"], bool):
        raise HTTPException(status_code=400, detail="available must be true or false")

    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment request not found")
    if appointment.status != AppointmentStatus.PENDING:
        raise HTTPException(status_code=400, detail="This appointment request has already been reviewed")

    if payload["available"]:
        consultation_format = str(
            payload.get("consultation_format") or appointment.consultation_format or "google_meet"
        ).strip().lower()
        if consultation_format not in CONSULTATION_FORMATS:
            raise HTTPException(status_code=400, detail="Choose Google Meet, phone, or in-person consultation")
        appointment.consultation_format = consultation_format
        appointment.status = AppointmentStatus.DOCTOR_CONFIRMED
        admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
        for admin in admins:
            create_notification(
                db=db,
                user_id=admin.id,
                notification_type=NotificationType.APPOINTMENT,
                title="Appointment Awaiting Approval",
                message=f"Dr. {current_user.name} confirmed availability for {appointment.user.name}'s {consultation_format.replace('_', ' ')} appointment on {appointment.appointment_date}.",
                link="/admin/appointments",
            )
        result = "doctor_confirmed"
    else:
        appointment.status = AppointmentStatus.REJECTED
        create_notification(
            db=db,
            user_id=appointment.user_id,
            notification_type=NotificationType.APPOINTMENT,
            title="Doctor Unavailable",
            message=f"Dr. {current_user.name} is unavailable for your requested appointment. Please choose another time or doctor.",
            link="/appointments",
        )
        result = "rejected"

    db.commit()
    return {"message": "Appointment response saved", "status": result}


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = "cancelled"
    db.commit()
    return {"message": "Appointment cancelled"}


@router.delete("/{appointment_id}/permanent")
def delete_appointment_permanently(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted permanently"}


@router.patch("/{appointment_id}/mark-seen", response_model=AppointmentResponse)
def mark_appointment_as_seen(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == current_user.id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(appointment.status).split(".")[-1].lower() == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot mark cancelled appointment as seen")
    if str(appointment.status).split(".")[-1].lower() != "approved":
        raise HTTPException(status_code=400, detail="Appointment must be approved before it can be completed")
    if str(appointment.payment_status).split(".")[-1].lower() != "completed":
        raise HTTPException(status_code=400, detail="Appointment must be paid before it can be completed")

    appointment.status = "completed"

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.APPOINTMENT,
        title="Appointment Updated",
        message=f"Appointment #{appointment.id} marked as doctor seen.",
        link=f"/appointments/{appointment.id}",
    )
    if appointment.doctor_id:
        create_notification(
            db=db,
            user_id=appointment.doctor_id,
            notification_type=NotificationType.APPOINTMENT,
            title="Patient Marked Visit as Seen",
            message=f"Patient confirmed consultation for appointment #{appointment.id}.",
            link="/doctor-dashboard",
        )

    db.commit()
    db.refresh(appointment)
    return appointment
