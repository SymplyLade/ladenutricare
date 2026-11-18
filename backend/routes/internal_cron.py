import hmac
import os

from fastapi import APIRouter, Header, HTTPException, status

from services.reminder_service import job_send_reminders, job_send_timed_reminders


router = APIRouter(prefix="/api/internal/cron", tags=["Scheduled jobs"])


def _require_cron_secret(authorization: str | None) -> None:
    secret = os.getenv("CRON_SECRET")
    expected = f"Bearer {secret}" if secret else ""
    if not secret or not authorization or not hmac.compare_digest(authorization, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )


@router.get("/daily-reminders", include_in_schema=False)
def run_daily_reminders(authorization: str | None = Header(default=None)):
    _require_cron_secret(authorization)
    job_send_reminders()
    return {"ok": True}


@router.get("/timed-reminders", include_in_schema=False)
def run_timed_reminders(authorization: str | None = Header(default=None)):
    _require_cron_secret(authorization)
    job_send_timed_reminders()
    return {"ok": True}
