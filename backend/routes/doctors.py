from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Doctor
from schemas import DoctorResponse

router = APIRouter()

@router.get("/", response_model=list[DoctorResponse])
def get_verified_doctors(db: Session = Depends(get_db)):
    doctors = (
        db.query(Doctor)
        .join(User, Doctor.user_id == User.id)
        .filter(
            User.role == "doctor",
            Doctor.is_verified == True,
            User.is_active == True
        )
        .all()
    )
    return [
        {
            "id": doctor.id,
            "doctor_user_id": doctor.user_id,
            "name": doctor.user.name if doctor.user else "Unknown",
            "specialization": doctor.specialization,
            "experience_years": doctor.experience_years,
            "consultation_fee": doctor.consultation_fee,
            "license_number": doctor.license_number,
            "is_verified": doctor.is_verified,
            "profile_picture": doctor.user.profile_picture if doctor.user else None,
        }
        for doctor in doctors
    ]
