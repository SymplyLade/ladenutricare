from uuid import uuid4
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Appointment, NotificationType, PaymentTransaction, User
from utils.notifications import create_notification

router = APIRouter()

ALLOWED_PAYMENT_METHODS = {
    "mastercard",
    "visa",
    "verve",
    "bank_transfer",
    "ussd",
    "wallet",
}

BANK_REQUIRED_FIELDS = {"bank_name", "account_name", "account_number"}
CARD_REQUIRED_FIELDS = {"card_holder", "card_number", "expiry", "cvv"}
USSD_REQUIRED_FIELDS = {"bank_name", "phone_number"}


@router.post("/initialize")
def initialize_payment(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment_id = payload.get("appointment_id")
    if not appointment_id:
        raise HTTPException(status_code=400, detail="appointment_id is required")

    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == int(appointment_id), Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(appointment.status).split(".")[-1].lower() == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot pay for a cancelled appointment")
    if str(appointment.payment_status).split(".")[-1].lower() == "completed":
        raise HTTPException(status_code=400, detail="Appointment already paid")

    payment_method = str(payload.get("payment_method") or "").strip().lower()
    if payment_method not in ALLOWED_PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid payment_method. Use one of: {', '.join(sorted(ALLOWED_PAYMENT_METHODS))}",
        )
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
        card_no = str(details.get("card_number") or "").strip()
        if len(card_no) < 12:
            raise HTTPException(status_code=400, detail="Invalid card_number")
        details["card_number"] = f"**** **** **** {card_no[-4:]}"
        details["cvv"] = "***"
    elif payment_method == "ussd":
        ensure_fields(USSD_REQUIRED_FIELDS)

    amount = float(appointment.consultation_fee or 0)
    transaction_id = f"txn_{uuid4().hex[:16]}"

    existing = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.appointment_id == appointment.id, PaymentTransaction.user_id == current_user.id)
        .order_by(PaymentTransaction.id.desc())
        .first()
    )
    if existing:
        existing.amount = amount
        existing.payment_method = payment_method
        existing.status = "pending"
        existing.transaction_id = transaction_id
        existing.notes = json.dumps(details)
        payment = existing
    else:
        payment = PaymentTransaction(
            user_id=current_user.id,
            appointment_id=appointment.id,
            amount=amount,
            payment_method=payment_method,
            status="pending",
            transaction_id=transaction_id,
            notes=json.dumps(details),
        )
        db.add(payment)

    appointment.payment_status = "pending"
    db.commit()
    db.refresh(payment)

    # This is a placeholder checkout URL. Replace with provider checkout session URL (Paystack/Flutterwave/Stripe).
    checkout_url = f"/api/payments/complete/{payment.id}?transaction_id={payment.transaction_id}"

    return {
        "payment_id": payment.id,
        "appointment_id": appointment.id,
        "amount": payment.amount,
        "currency": "NGN",
        "payment_method": payment_method,
        "status": str(payment.status).split(".")[-1].lower(),
        "transaction_id": payment.transaction_id,
        "checkout_url": checkout_url,
    }


@router.post("/complete/{payment_id}")
def complete_payment(
    payment_id: int,
    payload: dict | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.id == payment_id, PaymentTransaction.user_id == current_user.id)
        .first()
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payload and payload.get("transaction_id") and payload.get("transaction_id") != payment.transaction_id:
        raise HTTPException(status_code=400, detail="Invalid transaction_id")

    payment.status = "completed"
    if payment.appointment_id:
        appointment = db.query(Appointment).filter(Appointment.id == payment.appointment_id).first()
        if appointment:
            appointment.payment_status = "completed"
            create_notification(
                db=db,
                user_id=appointment.user_id,
                notification_type=NotificationType.PAYMENT,
                title="Payment Successful",
                message=f"Payment for appointment #{appointment.id} is confirmed.",
                link=f"/appointments/{appointment.id}",
            )
            if appointment.doctor_id:
                create_notification(
                    db=db,
                    user_id=appointment.doctor_id,
                    notification_type=NotificationType.PAYMENT,
                    title="Patient Payment Confirmed",
                    message=f"Payment confirmed for appointment #{appointment.id}.",
                    link="/doctor-dashboard",
                )

    db.commit()
    db.refresh(payment)

    return {
        "payment_id": payment.id,
        "status": str(payment.status).split(".")[-1].lower(),
        "transaction_id": payment.transaction_id,
    }


@router.get("/my")
def get_my_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.user_id == current_user.id)
        .order_by(PaymentTransaction.id.desc())
        .all()
    )
    return payments
