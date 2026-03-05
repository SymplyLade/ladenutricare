
# from contextlib import asynccontextmanager
# from fastapi import FastAPI, Depends, HTTPException, Request, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
# import os
# import logging
# from dotenv import load_dotenv

# load_dotenv()

# from database import engine, SessionLocal, Base, test_connection
# from models import (
#     User, Appointment, Medication, Symptom, 
#     EmergencyContact, PaymentTransaction, NutritionPlan,
#     ChatHistory, Notification, ExpiryCheck
# )
# from routes import (
#     auth, users, appointments, medications, symptoms,
#     chatbot, payments, notifications, nutrition,
#     video_consultation, admin, expiry_checker, emergency_contacts
# )

# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
# )
# logger = logging.getLogger(__name__)

# REQUIRED_ENV_VARS = ["JWT_SECRET"]
# missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
# if missing_vars:
#     raise RuntimeError(f"Missing required environment variables: {missing_vars}")

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info("Starting up LadeNutriCare API...")
#     if not test_connection():
#         logger.error("Database connection failed. Exiting.")
#         raise RuntimeError("Database connection failed")
#     Base.metadata.create_all(bind=engine)
#     logger.info("Database tables verified/created.")
#     yield
#     logger.info("Shutting down...")
#     engine.dispose()

# app = FastAPI(
#     title="LadeNutriCare Telemedicine API",
#     description="Complete telemedicine platform with video consultation, nutrition guide, and chatbot",
#     version="1.0.0",
#     docs_url="/api/docs",
#     redoc_url="/api/redoc",
#     lifespan=lifespan,
# )

# origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
# origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.middleware("http")
# async def add_process_time_header(request: Request, call_next):
#     import time
#     start_time = time.time()
#     response = await call_next(request)
#     process_time = time.time() - start_time
#     response.headers["X-Process-Time"] = str(process_time)
#     return response

# @app.exception_handler(HTTPException)
# async def http_exception_handler(request: Request, exc: HTTPException):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={
#             "error": exc.detail,
#             "status_code": exc.status_code,
#             "path": request.url.path
#         },
#     )

# @app.exception_handler(Exception)
# async def generic_exception_handler(request: Request, exc: Exception):
#     logger.error(f"Unhandled exception: {exc}", exc_info=True)
#     return JSONResponse(
#         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         content={
#             "error": "Internal server error",
#             "status_code": 500,
#             "path": request.url.path
#         },
#     )

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @app.get("/api/health")
# async def health_check(db: Session = Depends(get_db)):
#     try:
#         db.execute("SELECT 1").first()
#         db_status = "connected"
#     except Exception as e:
#         db_status = f"error: {str(e)}"
#     return {
#         "status": "healthy",
#         "service": "LadeNutriCare Telemedicine API",
#         "version": "1.0.0",
#         "database": db_status,
#         "timestamp": __import__("datetime").datetime.utcnow().isoformat()
#     }

# @app.get("/")
# async def root():
#     return {
#         "message": "LadeNutriCare Telemedicine API",
#         "docs": "/api/docs",
#         "version": "1.0.0"
#     }

# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])
# app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
# app.include_router(medications.router, prefix="/api/medications", tags=["Medications"])
# app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
# app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
# app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
# app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
# app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutrition"])
# app.include_router(video_consultation.router, prefix="/api/video", tags=["Video Consultation"])
# app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
# app.include_router(expiry_checker.router, prefix="/api/expiry", tags=["Expiry Checker"])
# app.include_router(emergency_contacts.router, prefix="/api/emergency", tags=["Emergency"])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8001,
#         reload=True,
#         log_level="info"
#     )






from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import logging
from dotenv import load_dotenv
from services.reminder_service import start_scheduler

load_dotenv()

from database import engine, SessionLocal, Base, test_connection

from models import (
    User, Appointment, Medication, Symptom,
    EmergencyContact, PaymentTransaction, NutritionPlan,
    ChatHistory, Notification, ExpiryCheck
)
from routes import (
    auth, users, doctors, appointments, consultations, medications, symptoms,
    chatbot, payments, notifications, nutrition,
    video_consultation, admin, expiry_checker, emergency_contacts
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

REQUIRED_ENV_VARS = ["JWT_SECRET"]
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {missing_vars}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up LadeNutriCare API...")
    if not test_connection():
        logger.error("Database connection failed. Exiting.")
        raise RuntimeError("Database connection failed")
    Base.metadata.create_all(bind=engine)
    scheduler = start_scheduler()
    logger.info("Database tables verified/created.")
    yield
    logger.info("Shutting down...")
    scheduler.shutdown(wait=False)
    engine.dispose()

app = FastAPI(
    title="LadeNutriCare Telemedicine API",
    description="Complete telemedicine platform with video consultation, nutrition guide, and chatbot",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

default_origins = "http://localhost:5173,http://localhost:3000,https://ladenutricare.onrender.com"
origins_str = os.getenv("CORS_ORIGINS", default_origins)
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": request.url.path
        },
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "status_code": 500,
            "path": request.url.path
        },
    )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1").first()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "healthy",
        "service": "LadeNutriCare Telemedicine API",
        "version": "1.0.0",
        "database": db_status,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    return {
        "message": "LadeNutriCare Telemedicine API",
        "docs": "/api/docs",
        "version": "1.0.0"
    }

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(consultations.router, prefix="/api/consultations", tags=["Consultations"])
app.include_router(medications.router, prefix="/api/medications", tags=["Medications"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutrition"])
app.include_router(video_consultation.router, prefix="/api/video", tags=["Video Consultation"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(expiry_checker.router, prefix="/api/expiry", tags=["Expiry Checker"])
app.include_router(emergency_contacts.router, prefix="/api/emergency", tags=["Emergency"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
