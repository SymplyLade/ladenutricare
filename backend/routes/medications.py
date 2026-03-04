from typing import List
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import ActivityLog, Medication, NotificationType, Symptom, User
from schemas import MedicationCreate, MedicationResponse, MedicationUpdate
from script import analyze_medication_safety
from utils.notifications import create_notification

router = APIRouter()


def _notify_admins_for_review(db: Session, title: str, message: str, link: str = "/admin") -> None:
    admins = db.query(User).filter(User.role == "admin", User.is_active == True).all()
    for admin in admins:
        create_notification(
            db=db,
            user_id=admin.id,
            notification_type=NotificationType.SYSTEM,
            title=title,
            message=message,
            link=link,
        )


def _resolve_end_date(end_date, duration_days):
    if end_date is not None:
        return datetime.combine(end_date, datetime.max.time())
    if duration_days:
        return datetime.now() + timedelta(days=int(duration_days))
    return None


@router.get("/", response_model=List[MedicationResponse])
def list_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meds = db.query(Medication).filter(Medication.user_id == current_user.id).all()
    return meds


@router.get("/safety-report")
def get_medication_safety_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meds = db.query(Medication).filter(Medication.user_id == current_user.id).all()
    latest_symptom = (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
        .first()
    )
    condition_text = f"{latest_symptom.symptoms} {latest_symptom.analysis}" if latest_symptom else ""
    names = [m.name for m in meds]
    checks = []
    for med in meds:
        other_names = [x for x in names if str(x).lower() != str(med.name).lower()]
        checks.append(analyze_medication_safety(med.name, other_names, condition_text))
    high_risk = [c for c in checks if c["severity"] == "high"]
    return {
        "total_medications": len(meds),
        "high_risk_count": len(high_risk),
        "checks": checks,
    }


@router.post("/", response_model=MedicationResponse)
def create_medication(
    medication_data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_medications = (
        db.query(Medication.name)
        .filter(Medication.user_id == current_user.id)
        .all()
    )
    existing_names = [x[0] for x in existing_medications]
    latest_symptom = (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
        .first()
    )
    condition_text = f"{latest_symptom.symptoms} {latest_symptom.analysis}" if latest_symptom else ""
    safety = analyze_medication_safety(medication_data.name, existing_names, condition_text)

    new_medication = Medication(
        user_id=current_user.id,
        name=medication_data.name,
        dosage=medication_data.dosage,
        frequency=medication_data.frequency,
        time_slots=medication_data.time_slots or [],
        end_date=_resolve_end_date(medication_data.end_date, medication_data.duration_days),
        notes=medication_data.notes,
    )
    db.add(new_medication)

    db.add(
        ActivityLog(
            user_id=current_user.id,
            action="clinical_decision",
            description=(
                f"Medication safety decision: {medication_data.name}; severity={safety['severity']}; "
                f"confidence={safety['confidence']}; warnings={'; '.join(safety['warnings']) or 'none'}"
            ),
        )
    )

    if safety["warnings"]:
        create_notification(
            db=db,
            user_id=current_user.id,
            notification_type=NotificationType.HEALTH_TIP if safety["severity"] != "high" else NotificationType.SYSTEM,
            title="Medication Safety Alert",
            message=(
                f"{medication_data.name}: {safety['warnings'][0]} "
                f"(risk: {safety['severity']})."
            ),
            link="/medications",
        )

    if safety["requires_human_review"]:
        db.add(
            ActivityLog(
                user_id=current_user.id,
                action="human_review_trigger",
                description=(
                    f"Medication review required for {medication_data.name}. "
                    f"Severity={safety['severity']}, confidence={safety['confidence']}."
                ),
            )
        )
        _notify_admins_for_review(
            db,
            title="Clinical Review Needed",
            message=(
                f"Medication safety review requested for user {current_user.id} "
                f"({medication_data.name}, risk {safety['severity']})."
            ),
            link="/admin",
        )

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

    incoming = payload.dict(exclude_unset=True)
    target_name = incoming.get("name", medication.name)
    existing_medications = (
        db.query(Medication.name)
        .filter(Medication.user_id == current_user.id, Medication.id != medication.id)
        .all()
    )
    existing_names = [x[0] for x in existing_medications]
    latest_symptom = (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
        .first()
    )
    condition_text = f"{latest_symptom.symptoms} {latest_symptom.analysis}" if latest_symptom else ""
    safety = analyze_medication_safety(target_name, existing_names, condition_text)

    duration_days = incoming.pop("duration_days", None) if isinstance(incoming, dict) else None
    for key, value in incoming.items():
        setattr(medication, key, value)
    if ("end_date" in incoming) or (duration_days is not None):
        medication.end_date = _resolve_end_date(incoming.get("end_date"), duration_days)

    db.add(
        ActivityLog(
            user_id=current_user.id,
            action="clinical_decision",
            description=(
                f"Medication update safety decision: {target_name}; severity={safety['severity']}; "
                f"confidence={safety['confidence']}; warnings={'; '.join(safety['warnings']) or 'none'}"
            ),
        )
    )
    if safety["requires_human_review"]:
        db.add(
            ActivityLog(
                user_id=current_user.id,
                action="human_review_trigger",
                description=(
                    f"Medication update review required for {target_name}. "
                    f"Severity={safety['severity']}, confidence={safety['confidence']}."
                ),
            )
        )
        _notify_admins_for_review(
            db,
            title="Clinical Review Needed",
            message=(
                f"Medication update requires review for user {current_user.id} "
                f"({target_name}, risk {safety['severity']})."
            ),
            link="/admin",
        )

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
