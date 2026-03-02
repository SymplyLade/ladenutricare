from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Medication, User
from schemas import MedicationCreate, MedicationResponse
from dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[MedicationResponse])
def list_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medications = db.query(Medication).filter(Medication.user_id == current_user.id).all()
    return medications

@router.post("/", response_model=MedicationResponse)
def create_medication(
    medication_data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_medication = Medication(
        user_id=current_user.id,
        **medication_data.dict()
    )
    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)
    return new_medication