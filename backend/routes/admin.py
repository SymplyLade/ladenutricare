from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from utils.notifications import create_notification
from models import Appointment, Doctor, NotificationType, NutritionPlan, PaymentTransaction, User

router = APIRouter()


def _require_admin(user: User):
    role_value = str(user.role).lower()
    if not role_value.endswith("admin"):
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    total_users = db.query(User).count()
    total_doctors = db.query(Doctor).count()
    appointments_today = (
        db.query(Appointment).filter(Appointment.appointment_date == date.today()).count()
    )
    pending_appointments = (
        db.query(Appointment).filter(Appointment.status == "pending").count()
    )
    total_revenue = (
        db.query(PaymentTransaction)
        .filter(PaymentTransaction.status == "completed")
        .with_entities(PaymentTransaction.amount)
        .all()
    )
    pending_verifications = db.query(Doctor).filter(Doctor.is_verified == False).count()

    return {
        "totalUsers": total_users,
        "totalDoctors": total_doctors,
        "appointmentsToday": appointments_today,
        "pendingAppointments": pending_appointments,
        "totalRevenue": round(sum(x[0] for x in total_revenue), 2),
        "pendingVerifications": pending_verifications,
    }


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    return db.query(User).order_by(User.id.desc()).all()


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key in ["name", "role", "is_active", "phone", "age", "gender", "address"]:
        if key in payload:
            setattr(user, key, payload[key])
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.get("/doctors")
def get_all_doctors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    doctors = db.query(Doctor).join(User, Doctor.user_id == User.id).all()
    return [
        {
            "id": doctor.id,
            "name": doctor.user.name if doctor.user else "Unknown",
            "specialization": doctor.specialization,
            "license_number": doctor.license_number,
            "experience_years": doctor.experience_years,
            "is_verified": doctor.is_verified,
            "consultation_fee": doctor.consultation_fee,
        }
        for doctor in doctors
    ]


@router.post("/doctors/{doctor_id}/verify")
def verify_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor.is_verified = True
    db.commit()
    return {"message": "Doctor verified"}


@router.put("/doctors/{doctor_id}")
def update_doctor(
    doctor_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    for key in ["specialization", "experience_years", "consultation_fee", "license_number"]:
        if key in payload:
            setattr(doctor, key, payload[key])

    if "name" in payload and doctor.user:
        doctor.user.name = payload["name"]

    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor updated"}


@router.get("/appointments")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    appointments = db.query(Appointment).order_by(Appointment.id.desc()).all()
    response = []
    for apt in appointments:
        patient = db.query(User).filter(User.id == apt.user_id).first()
        response.append(
            {
                "id": apt.id,
                "patient_name": patient.name if patient else "Unknown",
                "doctor_name": apt.doctor_name,
                "appointment_date": apt.appointment_date,
                "appointment_time": apt.appointment_time,
                "status": str(apt.status),
            }
        )
    return response


@router.patch("/appointments/{appointment_id}")
def update_appointment_status(
    appointment_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if "status" in payload:
        appointment.status = payload["status"]

    normalized_status = str(appointment.status).split(".")[-1].lower()

    create_notification(
        db=db,
        user_id=appointment.user_id,
        notification_type=NotificationType.APPOINTMENT,
        title="Appointment Status Updated",
        message=f"Your appointment with Dr. {appointment.doctor_name} is now {normalized_status}.",
        link=f"/appointments/{appointment.id}",
    )

    if appointment.doctor_id:
        create_notification(
            db=db,
            user_id=appointment.doctor_id,
            notification_type=NotificationType.APPOINTMENT,
            title="Appointment Status Updated",
            message=f"Appointment with {appointment.user.name if appointment.user else 'patient'} is now {normalized_status}.",
            link="/doctor-dashboard",
        )

    db.commit()
    return {"message": "Appointment updated"}


@router.get("/payments")
def get_all_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    payments = db.query(PaymentTransaction).order_by(PaymentTransaction.id.desc()).all()
    response = []
    for payment in payments:
        user = db.query(User).filter(User.id == payment.user_id).first()
        response.append(
            {
                "id": payment.id,
                "user_name": user.name if user else "Unknown",
                "amount": payment.amount,
                "payment_method": payment.payment_method,
                "status": str(payment.status),
            }
        )
    return response


@router.post("/payments/{payment_id}/refund")
def refund_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    payment = db.query(PaymentTransaction).filter(PaymentTransaction.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment.status = "refunded"
    db.commit()
    return {"message": "Payment refunded"}


# Compatibility endpoints for current admin nutrition UI.
_patient_types = [
    {
        "id": 1,
        "name": "Diabetes",
        "description": "Manage blood sugar levels with proper diet.",
        "general_advice": "Avoid sugary foods and monitor carb intake.",
    }
]
_meal_plans = [
    {
        "id": 1,
        "title": "Starter Diabetes Plan",
        "description": "Sample low-glycemic plan.",
        "patient_type_id": 1,
        "meals": {"breakfast": ["Oatmeal"], "lunch": ["Salad"], "dinner": ["Fish"]},
    }
]


@router.get("/patient-types")
def get_patient_types(current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    return _patient_types


@router.post("/patient-types")
def create_patient_type(payload: dict, current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    next_id = max([x["id"] for x in _patient_types], default=0) + 1
    item = {"id": next_id, **payload}
    _patient_types.append(item)
    return item


@router.put("/patient-types/{item_id}")
def update_patient_type(
    item_id: int, payload: dict, current_user: User = Depends(get_current_user)
):
    _require_admin(current_user)
    for idx, item in enumerate(_patient_types):
        if item["id"] == item_id:
            _patient_types[idx] = {**item, **payload}
            return _patient_types[idx]
    raise HTTPException(status_code=404, detail="Patient type not found")


@router.delete("/patient-types/{item_id}")
def delete_patient_type(item_id: int, current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    for idx, item in enumerate(_patient_types):
        if item["id"] == item_id:
            _patient_types.pop(idx)
            return {"message": "Patient type deleted"}
    raise HTTPException(status_code=404, detail="Patient type not found")


@router.get("/meal-plans")
def get_meal_plans(current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    return _meal_plans


@router.post("/meal-plans")
def create_meal_plan(payload: dict, current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    next_id = max([x["id"] for x in _meal_plans], default=0) + 1
    item = {"id": next_id, **payload}
    _meal_plans.append(item)
    return item


@router.put("/meal-plans/{item_id}")
def update_meal_plan(
    item_id: int, payload: dict, current_user: User = Depends(get_current_user)
):
    _require_admin(current_user)
    for idx, item in enumerate(_meal_plans):
        if item["id"] == item_id:
            _meal_plans[idx] = {**item, **payload}
            return _meal_plans[idx]
    raise HTTPException(status_code=404, detail="Meal plan not found")


@router.delete("/meal-plans/{item_id}")
def delete_meal_plan(item_id: int, current_user: User = Depends(get_current_user)):
    _require_admin(current_user)
    for idx, item in enumerate(_meal_plans):
        if item["id"] == item_id:
            _meal_plans.pop(idx)
            return {"message": "Meal plan deleted"}
    raise HTTPException(status_code=404, detail="Meal plan not found")


