import os

def send_sms(to_phone: str, message: str) -> bool:
    """
    Send an SMS using Twilio.
    Configure Twilio in .env:
        TWILIO_ACCOUNT_SID=your_sid
        TWILIO_AUTH_TOKEN=your_token
        TWILIO_PHONE_NUMBER=+1234567890
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")

    if not all([account_sid, auth_token, from_number]):
        print("❌ Twilio settings missing. Check .env")
        return False

    try:
        from twilio.rest import Client
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=message,
            from_=from_number,
            to=to_phone
        )
        return True
    except ImportError:
        print("❌ Twilio library not installed. Run: pip install twilio")
        return False
    except Exception as e:
        print(f"❌ SMS send failed: {e}")
        return False