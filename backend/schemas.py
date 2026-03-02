# from pydantic import BaseModel, EmailStr
# from typing import Optional, List
# from datetime import date, time

# # User schemas
# class UserBase(BaseModel):
#     name: str
#     email: EmailStr
#     phone: Optional[str] = None

# class UserCreate(UserBase):
#     password: str

# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str

# class UserResponse(UserBase):
#     id: int
#     role: str
#     is_active: bool
#     created_at: datetime

#     class Config:
#         from_attributes = True

# # Appointment schemas
# class AppointmentBase(BaseModel):
#     department: str
#     doctor_name: str
#     appointment_date: date
#     appointment_time: time
#     notes: Optional[str] = None

# class AppointmentCreate(AppointmentBase):
#     pass

# class AppointmentUpdate(BaseModel):
#     status: Optional[str] = None
#     notes: Optional[str] = None

# class AppointmentResponse(AppointmentBase):
#     id: int
#     user_id: int
#     doctor_id: Optional[int]
#     status: str
#     urgency: str
#     video_link: Optional[str]
#     payment_status: str
#     consultation_fee: float
#     created_at: datetime
#     updated_at: datetime

#     class Config:
#         from_attributes = True

# # Token
# class Token(BaseModel):
#     access_token: str
#     token_type: str


from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date, time

# ─── USER SCHEMAS ────────────────────────────────────────────────
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    profile_picture: Optional[str] = None

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

# ─── APPOINTMENT SCHEMAS ─────────────────────────────────────────
class AppointmentBase(BaseModel):
    department: str
    doctor_name: str
    appointment_date: date
    appointment_time: time
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    user_id: int
    doctor_id: Optional[int]
    status: str
    urgency: str
    video_link: Optional[str]
    payment_status: str
    consultation_fee: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ─── MEDICATION SCHEMAS ──────────────────────────────────────────
class MedicationBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    time_slots: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    notes: Optional[str] = None

class MedicationCreate(MedicationBase):
    pass

class MedicationResponse(MedicationBase):
    id: int
    user_id: int
    taken_today: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ─── SYMPTOM CHECK SCHEMAS ───────────────────────────────────────
class SymptomCheckRequest(BaseModel):
    symptoms: str
    duration: str

class SymptomCheckResponse(BaseModel):
    recommended_department: str
    urgency_level: str
    analysis: str
    advice: Optional[str] = None

# ─── PAYMENT SCHEMAS ─────────────────────────────────────────────
class PaymentBase(BaseModel):
    amount: float
    currency: str = "USD"
    payment_method: str
    appointment_id: Optional[int] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    user_id: int
    status: str
    transaction_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ─── EMERGENCY CONTACT SCHEMAS ───────────────────────────────────
class EmergencyContactBase(BaseModel):
    name: str
    relation: str
    phone: str

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactResponse(EmergencyContactBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ─── NOTIFICATION SCHEMAS ────────────────────────────────────────
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

# ─── NUTRITION PLAN SCHEMAS ──────────────────────────────────────
class NutritionPlanResponse(BaseModel):
    id: int
    title: str
    description: str
    plan_type: str
    meals: Optional[dict]
    nutrients: Optional[dict]
    duration_days: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ─── CHAT HISTORY SCHEMAS ────────────────────────────────────────
class ChatHistoryResponse(BaseModel):
    id: int
    message: str
    response: str
    message_type: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── EXPIRY CHECK SCHEMAS ────────────────────────────────────────
class ExpiryCheckRequest(BaseModel):
    batch_code: str
    expiry_date: date

class ExpiryCheckResponse(BaseModel):
    id: int
    batch_code: str
    expiry_date: date
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── TOKEN ───────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str