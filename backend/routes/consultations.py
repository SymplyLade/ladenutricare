from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import Appointment, ConsultationNote, DoctorTask, NotificationType, User
from schemas import ConsultationDocumentCreate
from utils.notifications import create_notification

router = APIRouter()


def _is_valid_hhmm(value: str) -> bool:
    if len(value) != 5 or value[2] != ":":
        return False
    hh = value[:2]
    mm = value[3:]
    if not (hh.isdigit() and mm.isdigit()):
        return False
    h = int(hh)
    m = int(mm)
    return 0 <= h <= 23 and 0 <= m <= 59


@router.post("/{appointment_id}/document")
def document_consultation(
    appointment_id: int,
    payload: ConsultationDocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    note = ConsultationNote(
        user_id=current_user.id,
        appointment_id=appointment.id,
        doctor_id=appointment.doctor_id,
        summary=payload.summary.strip(),
    )
    db.add(note)
    db.flush()

    created_tasks = []
    for task in payload.tasks:
        reminder_time = str(task.reminder_time).strip()
        if not _is_valid_hhmm(reminder_time):
            raise HTTPException(status_code=400, detail=f"Invalid reminder_time: {reminder_time}. Use HH:MM.")
        record = DoctorTask(
            user_id=current_user.id,
            appointment_id=appointment.id,
            consultation_note_id=note.id,
            task_text=task.task_text.strip(),
            reminder_time=reminder_time,
            is_daily=bool(task.is_daily),
            is_completed=False,
        )
        db.add(record)
        created_tasks.append(record)

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.HEALTH_TIP,
        title="Consultation Plan Saved",
        message="Your doctor conversation and daily tasks were saved with reminders.",
        link=f"/appointments/{appointment.id}",
    )
    db.commit()
    db.refresh(note)

    for task in created_tasks:
        db.refresh(task)

    return {
        "note": note,
        "tasks": created_tasks,
    }


@router.get("/{appointment_id}")
def get_consultation_documents(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    notes = (
        db.query(ConsultationNote)
        .filter(ConsultationNote.user_id == current_user.id, ConsultationNote.appointment_id == appointment_id)
        .order_by(ConsultationNote.created_at.desc())
        .all()
    )
    tasks = (
        db.query(DoctorTask)
        .filter(DoctorTask.user_id == current_user.id, DoctorTask.appointment_id == appointment_id)
        .order_by(DoctorTask.created_at.desc())
        .all()
    )
    return {"notes": notes, "tasks": tasks}


@router.patch("/tasks/{task_id}/complete")
def complete_doctor_task(
    task_id: int,
    payload: dict | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(DoctorTask).filter(DoctorTask.id == task_id, DoctorTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    done = True
    if isinstance(payload, dict) and "is_completed" in payload:
        done = bool(payload.get("is_completed"))

    task.is_completed = done
    db.commit()
    db.refresh(task)
    return task
