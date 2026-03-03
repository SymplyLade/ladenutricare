from datetime import date, timedelta
from sqlalchemy.orm import Session
from models import Appointment, User, Notification
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