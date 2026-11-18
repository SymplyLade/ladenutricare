# Google Meet setup

The Meet integration uses the Google Meet REST API with each doctor's own Google OAuth connection. Enable the Google Meet API in a Google Cloud project and create a **Web application** OAuth client. Add this authorized redirect URI to the client:

```text
http://localhost:8000/api/video/google/callback
```

Set these values in `backend/.env` (use the deployed API callback URL outside local development):

```dotenv
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/api/video/google/callback
FRONTEND_URL=http://localhost:5173
GOOGLE_TOKEN_ENCRYPTION_KEY=your-fernet-key
```

Generate a Fernet key with:

```powershell
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Install the backend requirements and restart the API. Each doctor connects Google from the Doctor Dashboard. After admin approval and patient payment, only the assigned doctor can create the Google Meet and notify the patient.
