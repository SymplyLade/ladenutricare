from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import ActivityLog, NotificationType, Symptom, User
from schemas import (
    SymptomCheckRequest,
    SymptomCheckResponse,
    SymptomFollowUpRequest,
    SymptomFollowUpResponse,
)
from script import analyze_symptoms_bundle
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


@router.post("/check", response_model=SymptomCheckResponse)
def check_symptoms(
    payload: SymptomCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = analyze_symptoms_bundle(payload.symptoms, payload.duration)

    symptom_log = Symptom(
        user_id=current_user.id,
        symptoms=payload.symptoms,
        duration=payload.duration,
        recommended_department=result["recommended_department"],
        urgency_level=result["urgency_level"],
        analysis=result["analysis"],
        advice=result["advice"],
    )
    db.add(symptom_log)
    db.add(
        ActivityLog(
            user_id=current_user.id,
            action="clinical_decision",
            description=(
                f"Symptom triage decision: dept={result['recommended_department']}; "
                f"doctor={result['doctor_type']}; urgency={result['urgency_level']}; "
                f"confidence={result['confidence']}; emergency={result['emergency_flag']}; "
                f"matches={', '.join(result['matched_keywords']) if result['matched_keywords'] else 'none'}"
            ),
        )
    )

    urgency_label = str(result["urgency_level"]).lower()
    if urgency_label == "high":
        create_notification(
            db=db,
            user_id=current_user.id,
            notification_type=NotificationType.SYSTEM,
            title="Critical Symptom Alert",
            message=(
                f"Urgent symptoms detected. Recommended: {result['doctor_type']} ({result['recommended_department']}). "
                "Seek emergency care immediately."
            ),
            link="/symptom-checker",
        )
    elif urgency_label == "medium":
        create_notification(
            db=db,
            user_id=current_user.id,
            notification_type=NotificationType.HEALTH_TIP,
            title="Priority Medical Follow-up",
            message=(
                f"Please book a {result['doctor_type']} appointment soon. "
                f"Department: {result['recommended_department']}."
            ),
            link="/appointments/new",
        )
    else:
        create_notification(
            db=db,
            user_id=current_user.id,
            notification_type=NotificationType.HEALTH_TIP,
            title="Routine Symptom Follow-up",
            message=(
                f"Monitor symptoms and book {result['doctor_type']} if they persist. "
                f"Department: {result['recommended_department']}."
            ),
            link="/appointments/new",
        )

    needs_human_review = bool(result["emergency_flag"]) or str(result["urgency_level"]).lower() == "high" or str(result["confidence"]).lower() == "low"
    if needs_human_review:
        db.add(
            ActivityLog(
                user_id=current_user.id,
                action="human_review_trigger",
                description=(
                    f"Symptom review required: dept={result['recommended_department']}; "
                    f"urgency={result['urgency_level']}; confidence={result['confidence']}."
                ),
            )
        )
        _notify_admins_for_review(
            db,
            title="Symptom Case Needs Clinical Review",
            message=(
                f"User {current_user.id} triage flagged for review "
                f"(dept {result['recommended_department']}, urgency {result['urgency_level']}, confidence {result['confidence']})."
            ),
            link="/admin",
        )

    db.commit()

    return {
        "recommended_department": result["recommended_department"],
        "doctor_type": result["doctor_type"],
        "urgency_level": result["urgency_level"],
        "confidence": result["confidence"],
        "matched_keywords": result["matched_keywords"],
        "emergency_flag": result["emergency_flag"],
        "next_steps": result["next_steps"],
        "analysis": result["analysis"],
        "advice": result["advice"],
    }


@router.post("/follow-up", response_model=SymptomFollowUpResponse)
def submit_follow_up(
    payload: SymptomFollowUpRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    latest = (
        db.query(Symptom)
        .filter(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
        .first()
    )
    if not latest:
        raise HTTPException(status_code=404, detail="No prior symptom check found")

    status = str(payload.status or "").strip().lower()
    if status not in {"better", "same", "worse"}:
        raise HTTPException(status_code=400, detail="status must be one of: better, same, worse")

    base_department = str(latest.recommended_department or "General Medicine")
    base_urgency = str(latest.urgency_level).split(".")[-1].lower()

    if status == "worse":
        escalated = {"low": "medium", "medium": "high", "high": "high"}
        urgency = escalated.get(base_urgency, "high")
        next_action = "Urgent review needed. Book immediate appointment."
        message = "Symptoms are worsening. Seek prompt medical review now."
        title = "Follow-up Escalation Alert"
    elif status == "same":
        urgency = base_urgency
        next_action = "Re-evaluation recommended within 24-48 hours."
        message = "Symptoms unchanged. Book follow-up review."
        title = "Follow-up Reminder"
    else:
        urgency = "low"
        next_action = "Continue monitoring and maintain care plan."
        message = "Good progress reported. Keep monitoring."
        title = "Recovery Update"

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.HEALTH_TIP if urgency != "high" else NotificationType.SYSTEM,
        title=title,
        message=f"{message} Department: {base_department}.",
        link="/symptom-checker",
    )
    db.commit()

    return {
        "status": status,
        "recommended_department": base_department,
        "urgency_level": urgency,
        "next_action": next_action,
        "message": message,
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
