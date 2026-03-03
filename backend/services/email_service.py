from utils.email import send_email

def send_appointment_reminder_email(to_email: str, patient_name: str, doctor_name: str, date, time):
    subject = "Appointment Reminder"
    html_content = f"""
    <html>
        <body>
            <h2>Hello {patient_name},</h2>
            <p>This is a reminder that you have an appointment with <strong>Dr. {doctor_name}</strong> tomorrow at <strong>{time}</strong>.</p>
            <p>Thank you for choosing LadeNutriCare.</p>
        </body>
    </html>
    """
    text_content = f"Hello {patient_name},\n\nThis is a reminder that you have an appointment with Dr. {doctor_name} tomorrow at {time}.\n\nThank you for choosing LadeNutriCare."
    send_email([to_email], subject, html_content, text_content)

def send_appointment_confirmation_email(to_email: str, patient_name: str, doctor_name: str, date, time):
    subject = "Appointment Confirmed"
    html_content = f"""
    <html>
        <body>
            <h2>Hello {patient_name},</h2>
            <p>Your appointment with <strong>Dr. {doctor_name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> has been confirmed.</p>
            <p>Thank you for choosing LadeNutriCare.</p>
        </body>
    </html>
    """
    text_content = f"Hello {patient_name},\n\nYour appointment with Dr. {doctor_name} on {date} at {time} has been confirmed.\n\nThank you for choosing LadeNutriCare."
    send_email([to_email], subject, html_content, text_content)