# Vercel backend deployment

Deploy `backend/` as its own Vercel project and set its Root Directory to `backend`. Vercel detects the FastAPI app in `main.py` and installs dependencies from `requirements.txt`.

Set these Vercel environment variables before deploying:

- `DATABASE_URL`: an externally reachable PostgreSQL or MySQL connection URL. Use a managed database; the function filesystem is not persistent storage.
- `JWT_SECRET`: a long, private random value.
- `CORS_ORIGINS`: comma-separated frontend origins, including `https://ladenutricare.vercel.app`.
- `CRON_SECRET`: a long, private random value used to protect scheduled reminder endpoints.
- `FRONTEND_URL`: the production frontend URL, used for post-consultation links.
- `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REDIRECT_URI`: required for doctors to connect Google Meet. Set the redirect URI to `<backend-url>/api/video/google/callback` and add the same URI to the Google OAuth client.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `FROM_EMAIL`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`: set these when enabling email or SMS delivery.

The backend's `vercel.json` schedules daily reminders at 08:00 in Lagos (07:00 UTC) and timed reminders every minute. Vercel Hobby does not support minutely cron schedules; use a plan that supports that frequency or an external scheduler to preserve medication and doctor-task reminder timing.

The frontend production build uses `https://ladenutricare-jae5.vercel.app/api` as its API URL. Profile pictures are stored in the configured database so they persist across serverless function invocations.

Vercel Hobby cron schedules run at most once per day with hour-level precision. The timed reminder job is configured to run every minute, so preserving medication and doctor-task reminder timing requires a plan that supports minutely schedules or a separate scheduler.
