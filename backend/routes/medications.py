from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Medication, User
from schemas import MedicationCreate, MedicationResponse, MedicationUpdate

router = APIRouter()


@router.get("/", response_model=List[MedicationResponse])
def list_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Medication).filter(Medication.user_id == current_user.id).all()


@router.post("/", response_model=MedicationResponse)
def create_medication(
    medication_data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_medication = Medication(
        user_id=current_user.id,
        name=medication_data.name,
        dosage=medication_data.dosage,
        frequency=medication_data.frequency,
        time_slots=medication_data.time_slots or [],
        notes=medication_data.notes,
    )
    db.add(new_medication)
    db.commit()
    db.refresh(new_medication)
    return new_medication


@router.put("/{medication_id}", response_model=MedicationResponse)
def update_medication(
    medication_id: int,
    payload: MedicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medication = db.query(Medication).filter(
        Medication.id == medication_id, Medication.user_id == current_user.id
    ).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(medication, key, value)

    db.commit()
    db.refresh(medication)
    return medication


@router.delete("/{medication_id}")
def delete_medication(
    medication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medication = db.query(Medication).filter(
        Medication.id == medication_id, Medication.user_id == current_user.id
    ).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(medication)
    db.commit()
    return {"message": "Medication deleted"}
