from utils.sms import send_sms

def send_appointment_reminder_sms(to_phone: str, patient_name: str, doctor_name: str, date, time):
    message = f"Hello {patient_name}, reminder: You have an appointment with Dr. {doctor_name} tomorrow at {time}. - LadeNutriCare"
    send_sms(to_phone, message)

def send_appointment_confirmation_sms(to_phone: str, patient_name: str, doctor_name: str, date, time):
    message = f"Hello {patient_name}, your appointment with Dr. {doctor_name} on {date} at {time} is confirmed. - LadeNutriCare"
    send_sms(to_phone, message)