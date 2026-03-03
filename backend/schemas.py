from datetime import date, datetime, time
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"
    specialization: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True


class DoctorResponse(BaseModel):
    id: int
    doctor_user_id: int
    name: str
    specialization: str
    experience_years: int
    consultation_fee: float
    license_number: Optional[str] = None
    is_verified: bool
    profile_picture: Optional[str] = None


class AppointmentBase(BaseModel):
    department: str
    appointment_date: date
    appointment_time: time
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    doctor_id: int


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: int
    user_id: int
    doctor_id: Optional[int]
    doctor_name: str
    status: str
    urgency: str
    video_link: Optional[str]
    payment_status: str
    consultation_fee: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MedicationCreate(BaseModel):
    name: str
    dosage: str
    frequency: str
    time_slots: Optional[List[str]] = None
    notes: Optional[str] = None


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    time_slots: Optional[List[str]] = None
    taken_today: Optional[bool] = None
    notes: Optional[str] = None


class MedicationResponse(BaseModel):
    id: int
    name: str
    dosage: str
    frequency: str
    time_slots: Optional[List[str]]
    taken_today: bool
    notes: Optional[str]

    class Config:
        from_attributes = True


class SymptomCheckRequest(BaseModel):
    symptoms: str
    duration: str


class SymptomCheckResponse(BaseModel):
    recommended_department: str
    urgency_level: str
    analysis: str
    advice: Optional[str]


class EmergencyContactCreate(BaseModel):
    name: str
    relation: str
    phone: str


class EmergencyContactResponse(BaseModel):
    id: int
    name: str
    relation: str
    phone: str

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    is_read: bool
    link: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentResponse(BaseModel):
    id: int
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class NutritionPlanResponse(BaseModel):
    id: int
    title: str
    description: str
    plan_type: str
    meals: Optional[dict]
    is_active: bool

    class Config:
        from_attributes = True


class CustomNutritionPlanCreate(BaseModel):
    title: Optional[str] = Field(default="My Custom Meal Plan", max_length=255)
    description: Optional[str] = Field(default="User-defined meal plan")
    desired_meal_plan: str = Field(min_length=10, max_length=3000)


class Token(BaseModel):
    access_token: str
    token_type: str
