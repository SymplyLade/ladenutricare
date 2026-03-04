from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from database import SessionLocal
from utils.reminders import (
    send_doctor_task_reminders,
    send_medication_time_reminders,
    send_reminders_for_tomorrow,
)


def job_send_reminders():
    db = SessionLocal()
    try:
        send_reminders_for_tomorrow(db)
    finally:
        db.close()


def job_send_timed_reminders():
    db = SessionLocal()
    try:
        send_doctor_task_reminders(db)
        send_medication_time_reminders(db)
    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        job_send_reminders,
        trigger=CronTrigger(hour=8, minute=0),
        id="daily_reminders",
        replace_existing=True,
    )
    scheduler.add_job(
        job_send_timed_reminders,
        trigger=CronTrigger(minute="*"),
        id="timed_reminders",
        replace_existing=True,
    )
    scheduler.start()
    print("Reminder scheduler started.")
    return scheduler
