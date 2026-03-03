from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Symptom, User
from schemas import SymptomCheckRequest, SymptomCheckResponse

router = APIRouter()


def _analyze(symptoms: str):
    normalized = symptoms.lower()
    if any(k in normalized for k in ["chest pain", "shortness of breath", "fainting"]):
        return ("Cardiology", "high")
    if any(k in normalized for k in ["fever", "cough", "cold", "flu"]):
        return ("General Medicine", "medium")
    if any(k in normalized for k in ["rash", "itching", "skin"]):
        return ("Dermatology", "low")
    if any(k in normalized for k in ["headache", "migraine", "dizziness"]):
        return ("Neurology", "medium")
    return ("General Medicine", "low")


@router.post("/check", response_model=SymptomCheckResponse)
def check_symptoms(
    payload: SymptomCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    department, urgency = _analyze(payload.symptoms)
    analysis = (
        f"Based on reported symptoms ({payload.symptoms}) over {payload.duration}, "
        f"the likely department is {department}."
    )
    advice = (
        "Seek immediate in-person care if symptoms worsen suddenly. "
        "Otherwise, book an appointment for clinical confirmation."
    )

    symptom_log = Symptom(
        user_id=current_user.id,
        symptoms=payload.symptoms,
        duration=payload.duration,
        recommended_department=department,
        urgency_level=urgency,
        analysis=analysis,
        advice=advice,
    )
    db.add(symptom_log)
    db.commit()

    return {
        "recommended_department": department,
        "urgency_level": urgency,
        "analysis": analysis,
        "advice": advice,
    }


@router.get("/")
def get_symptom_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
        .all()
    )
