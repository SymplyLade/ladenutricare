from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from database import SessionLocal
from utils.reminders import send_reminders_for_tomorrow

def job_send_reminders():
    """Job to be run daily at a specified time."""
    db = SessionLocal()
    try:
        send_reminders_for_tomorrow(db)
    finally:
        db.close()

def start_scheduler():
    """Call this once when the app starts."""
    scheduler = BackgroundScheduler()
    # Run every day at 8:00 AM
    scheduler.add_job(
        job_send_reminders,
        trigger=CronTrigger(hour=8, minute=0),
        id="daily_reminders",
        replace_existing=True
    )
    scheduler.start()
    print("✅ Reminder scheduler started.")