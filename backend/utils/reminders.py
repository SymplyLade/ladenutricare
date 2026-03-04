from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from models import ActivityLog, Appointment, DoctorTask, Medication, Notification, User
from services.email_service import send_appointment_reminder_email
from services.sms_service import send_appointment_reminder_sms

def send_reminders_for_tomorrow(db: Session):
    """
    Find appointments scheduled for tomorrow and send reminders.
    Should be called daily by a background scheduler.
    """
    tomorrow = date.today() + timedelta(days=1)
    appointments = db.query(Appointment).filter(
        Appointment.appointment_date == tomorrow,
        Appointment.status == "approved"
    ).all()

    for apt in appointments:
        # Get patient and doctor
        patient = db.query(User).get(apt.user_id)
        doctor = db.query(User).get(apt.doctor_id)

        # Send email (if patient has email)
        if patient and patient.email:
            send_appointment_reminder_email(
                to_email=patient.email,
                patient_name=patient.name,
                doctor_name=doctor.name if doctor else "your doctor",
                date=apt.appointment_date,
                time=apt.appointment_time
            )

        # Send SMS (if patient has phone)
        if patient and patient.phone:
            send_appointment_reminder_sms(
                to_phone=patient.phone,
                patient_name=patient.name,
                doctor_name=doctor.name if doctor else "your doctor",
                date=apt.appointment_date,
                time=apt.appointment_time
            )

        # Create in‑app notification for patient
        notification = Notification(
            user_id=patient.id,
            type="appointment",
            title="Appointment Reminder",
            message=f"Reminder: You have an appointment with Dr. {doctor.name} tomorrow at {apt.appointment_time}.",
            link=f"/appointments/{apt.id}"
        )
        db.add(notification)

    db.commit()


def _already_sent_today(db: Session, action: str, marker: str) -> bool:
    today_str = date.today().isoformat()
    existing = (
        db.query(ActivityLog)
        .filter(ActivityLog.action == action, ActivityLog.description == f"{marker}|{today_str}")
        .first()
    )
    return existing is not None


def _mark_sent_today(db: Session, user_id: int, action: str, marker: str) -> None:
    today_str = date.today().isoformat()
    db.add(
        ActivityLog(
            user_id=user_id,
            action=action,
            description=f"{marker}|{today_str}",
        )
    )


def send_doctor_task_reminders(db: Session, now: datetime | None = None):
    current = now or datetime.now()
    hhmm = current.strftime("%H:%M")

    tasks = (
        db.query(DoctorTask)
        .filter(
            DoctorTask.is_completed == False,
            DoctorTask.is_daily == True,
            DoctorTask.reminder_time == hhmm,
        )
        .all()
    )

    for task in tasks:
        marker = f"doctor_task_reminder:{task.id}:{hhmm}"
        if _already_sent_today(db, "doctor_task_reminder_sent", marker):
            continue

        notification = Notification(
            user_id=task.user_id,
            type="health_tip",
            title="Doctor Task Reminder",
            message=f"Time for: {task.task_text}",
            link=f"/appointments/{task.appointment_id}",
        )
        db.add(notification)
        task.last_reminded_at = current
        _mark_sent_today(db, task.user_id, "doctor_task_reminder_sent", marker)

    db.commit()


def send_medication_time_reminders(db: Session, now: datetime | None = None):
    current = now or datetime.now()
    hhmm = current.strftime("%H:%M")

    medications = db.query(Medication).all()
    for med in medications:
        if med.end_date and current > med.end_date:
            continue
        slots = med.time_slots or []
        if hhmm not in [str(s).strip() for s in slots if str(s).strip()]:
            continue
        marker = f"medication_reminder:{med.id}:{hhmm}"
        if _already_sent_today(db, "medication_reminder_sent", marker):
            continue

        notification = Notification(
            user_id=med.user_id,
            type="medication",
            title="Medication Reminder",
            message=f"Take {med.name} ({med.dosage}) now.",
            link="/medications",
        )
        db.add(notification)
        _mark_sent_today(db, med.user_id, "medication_reminder_sent", marker)

    db.commit()
