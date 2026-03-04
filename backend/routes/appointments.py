from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4

from database import get_db
from models import Appointment, Doctor, NotificationType, PaymentTransaction, User
from schemas import AppointmentCreate, AppointmentResponse
from dependencies import get_current_user
from utils.notifications import create_notification

router = APIRouter()
FIXED_CONSULTATION_FEE = 10000.0
ALLOWED_PAYMENT_METHODS = {"mastercard", "visa", "verve", "bank_transfer", "ussd", "wallet"}
BANK_REQUIRED_FIELDS = {"bank_name", "account_name", "account_number"}
CARD_REQUIRED_FIELDS = {"card_holder", "card_number", "expiry", "cvv"}
USSD_REQUIRED_FIELDS = {"bank_name", "phone_number"}


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
        consultation_fee=FIXED_CONSULTATION_FEE,
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


@router.post("/with-payment", response_model=AppointmentResponse)
def create_appointment_with_payment(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment_method = str(payload.get("payment_method") or "").strip().lower()
    if payment_method not in ALLOWED_PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid payment_method. Use one of: {', '.join(sorted(ALLOWED_PAYMENT_METHODS))}",
        )

    try:
        appointment_data = AppointmentCreate(
            department=payload.get("department"),
            doctor_id=int(payload.get("doctor_id")),
            appointment_date=payload.get("appointment_date"),
            appointment_time=payload.get("appointment_time"),
            notes=payload.get("notes"),
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid appointment data: {exc}") from exc

    doctor = db.query(User).filter(User.id == appointment_data.doctor_id).first()
    if not doctor or not str(doctor.role).lower().endswith("doctor"):
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor_profile = db.query(Doctor).filter(Doctor.user_id == doctor.id).first()
    if not doctor_profile:
        raise HTTPException(status_code=400, detail="Doctor profile not found")
    if not doctor_profile.is_verified:
        raise HTTPException(status_code=400, detail="Doctor is not verified yet")

    transaction_id = f"txn_{uuid4().hex[:16]}"
    payment = PaymentTransaction(
        user_id=current_user.id,
        amount=FIXED_CONSULTATION_FEE,
        payment_method=payment_method,
        status="completed",
        transaction_id=transaction_id,
        notes=str(details),
    )
    db.add(payment)
    db.flush()

    new_appointment = Appointment(
        user_id=current_user.id,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        department=appointment_data.department,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        consultation_fee=FIXED_CONSULTATION_FEE,
        payment_status="completed",
        notes=appointment_data.notes,
    )
    db.add(new_appointment)
    db.flush()

    payment.appointment_id = new_appointment.id

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.PAYMENT,
        title="Payment Successful",
        message=f"Payment confirmed. Your appointment with Dr. {doctor.name} is booked.",
        link=f"/appointments/{new_appointment.id}",
    )
    create_notification(
        db=db,
        user_id=doctor.id,
        notification_type=NotificationType.APPOINTMENT,
        title="New Paid Appointment",
        message=f"{current_user.name} booked a paid appointment on {appointment_data.appointment_date} at {appointment_data.appointment_time}.",
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
    details = payload.get("payment_details") or {}
    if not isinstance(details, dict):
        raise HTTPException(status_code=400, detail="payment_details must be an object")

    def ensure_fields(required: set[str]):
        missing = [k for k in required if not str(details.get(k) or "").strip()]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing payment details: {', '.join(missing)}")

    if payment_method == "bank_transfer":
        ensure_fields(BANK_REQUIRED_FIELDS)
    elif payment_method in {"mastercard", "visa", "verve"}:
        ensure_fields(CARD_REQUIRED_FIELDS)
    elif payment_method == "ussd":
        ensure_fields(USSD_REQUIRED_FIELDS)
