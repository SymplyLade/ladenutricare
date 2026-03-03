from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Appointment, Doctor, NotificationType, User
from schemas import AppointmentCreate, AppointmentResponse
from dependencies import get_current_user
from utils.notifications import create_notification

router = APIRouter()


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

    new_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        department=appointment_data.department,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        notes=appointment_data.notes,
    )
    db.add(new_appointment)
    db.flush()

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.APPOINTMENT,
        title="Appointment Booked",
        message=f"Your appointment with Dr. {doctor.name} has been booked and is awaiting confirmation.",
        link=f"/appointments/{new_appointment.id}",
    )

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
            "notes": appointment.notes,
        }
        for appointment in appointments
    ]


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
