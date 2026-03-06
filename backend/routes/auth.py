# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from datetime import timedelta
# from typing import Any

# from database import get_db
# from models import User
# from schemas import UserCreate, UserLogin, Token, UserResponse  # we'll create schemas later
# from utils.auth import (
#     verify_password,
#     get_password_hash,
#     create_access_token,
#     ACCESS_TOKEN_EXPIRE_MINUTES,
# )

# router = APIRouter()

# @router.post("/register", response_model=UserResponse)
# def register(user_data: UserCreate, db: Session = Depends(get_db)):
#     # Check if user exists
#     existing_user = db.query(User).filter(User.email == user_data.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     # Create new user
#     hashed_password = get_password_hash(user_data.password)
#     new_user = User(
#         name=user_data.name,
#         email=user_data.email,
#         password_hash=hashed_password,
#         phone=user_data.phone,
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user

# @router.post("/login", response_model=Token)
# def login(user_data: UserLogin, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == user_data.email).first()
#     if not user or not verify_password(user_data.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": str(user.id)}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.get("/me", response_model=UserResponse)
# def get_current_user_info(current_user: User = Depends(get_current_user)):
#     return current_user



# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from datetime import timedelta

# from database import get_db
# from models import User
# from schemas import UserCreate, UserLogin, Token, UserResponse
# from utils.auth import (
#     verify_password,
#     get_password_hash,
#     create_access_token,
#     ACCESS_TOKEN_EXPIRE_MINUTES,
# )
# from dependencies import get_current_user

# router = APIRouter()

# @router.post("/register", response_model=UserResponse)
# def register(user_data: UserCreate, db: Session = Depends(get_db)):
#     # Check if user already exists
#     existing_user = db.query(User).filter(User.email == user_data.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
    
#     # Create new user
#     hashed_password = get_password_hash(user_data.password)
#     new_user = User(
#         name=user_data.name,
#         email=user_data.email,
#         password_hash=hashed_password,
#         phone=user_data.phone,
#         # role defaults to USER, is_active defaults to True
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user

# @router.post("/login", response_model=Token)
# def login(user_data: UserLogin, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == user_data.email).first()
#     if not user or not verify_password(user_data.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": str(user.id)}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.get("/me", response_model=UserResponse)
# def get_current_user_info(current_user: User = Depends(get_current_user)):
#     return current_user



# # routes/auth.py
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from models import User
# from database import get_db
# from schemas import UserResponse, UserCreate
# from utils.auth import verify_password, create_access_token
# from utils.dependencies import get_current_user
# from datetime import timedelta

# router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/login")
# def login(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.email == user.email).first()
#     if not db_user or not verify_password(user.password, db_user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     access_token_expires = timedelta(minutes=30)
#     access_token = create_access_token(
#         data={"sub": str(db_user.id)}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @router.get("/me", response_model=UserResponse)
# def get_current_user_info(current_user: User = Depends(get_current_user)):
#     return current_user


from datetime import datetime, timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db
from models import Doctor, PasswordResetToken, User, UserRole
from schemas import UserCreate, UserLogin, Token, UserResponse
from utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from dependencies import get_current_user

router = APIRouter()  # No extra prefix

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    requested_role = (user_data.role or "user").strip().lower()
    if requested_role not in {role.value for role in UserRole}:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        phone=user_data.phone,
        role=requested_role,
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Registration failed due to invalid or duplicate data")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")
    db.refresh(new_user)

    if requested_role == UserRole.DOCTOR.value:
        doctor_profile = Doctor(
            user_id=new_user.id,
            specialization=user_data.specialization or "General Medicine",
            license_number=f"DOC-{new_user.id}",
            experience_years=1,
            is_verified=False,
            consultation_fee=50.0,
        )
        db.add(doctor_profile)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Doctor profile could not be created")
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(status_code=500, detail="Doctor profile setup failed. Please try again.")

    return new_user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == email).first()
    if user:
        token = secrets.token_urlsafe(32)
        reset = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(hours=1),
            used=False,
        )
        db.add(reset)
        db.commit()
    # Security: same response whether email exists or not.
    return {"message": "If the account exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    token = payload.get("token")
    new_password = payload.get("new_password")
    if not token or not new_password:
        raise HTTPException(status_code=400, detail="Token and new_password are required")

    reset = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == token, PasswordResetToken.used == False)
        .first()
    )
    if not reset or reset.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == reset.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(new_password)
    reset.used = True
    db.commit()
    return {"message": "Password reset successful"}
