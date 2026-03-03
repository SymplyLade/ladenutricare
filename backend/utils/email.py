import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

def send_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: str = None
) -> bool:
    """
    Send an email using SMTP (Gmail example).
    Configure SMTP settings in .env:
        SMTP_HOST=smtp.gmail.com
        SMTP_PORT=587
        SMTP_USER=your_email@gmail.com
        SMTP_PASSWORD=your_app_password
        FROM_EMAIL=noreply@ladenutricare.com
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL", smtp_user)

    if not all([smtp_host, smtp_port, smtp_user, smtp_password]):
        print("❌ Email settings missing. Check .env")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = ", ".join(to_emails)

    # Plain text version
    if text_content:
        msg.attach(MIMEText(text_content, "plain"))
    # HTML version
    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_emails, msg.as_string())
        return True
    except Exception as e:
        print(f"❌ Email send failed: {e}")
        return False