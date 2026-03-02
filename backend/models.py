

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, Enum, ForeignKey, JSON, Date, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# ─── ENUMS ───────────────────────────────────────────────────────
class UserRole(str, enum.Enum):
    USER = "user"
    DOCTOR = "doctor"
    ADMIN = "admin"

class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class UrgencyLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class NotificationType(str, enum.Enum):
    APPOINTMENT = "appointment"
    MEDICATION = "medication"
    PAYMENT = "payment"
    HEALTH_TIP = "health_tip"
    SYSTEM = "system"

# ─── USER MODEL ─────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True, index=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    blood_group = Column(String(10), nullable=True)
    address = Column(Text, nullable=True)
    profile_picture = Column(String(500), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    appointments = relationship("Appointment", back_populates="user", foreign_keys="Appointment.user_id", cascade="all, delete-orphan")
    doctor_appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")
    symptoms = relationship("Symptom", back_populates="user", cascade="all, delete-orphan")
    emergency_contacts = relationship("EmergencyContact", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("PaymentTransaction", back_populates="user", cascade="all, delete-orphan")
    nutrition_plans = relationship("NutritionPlan", back_populates="user", cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    expiry_checks = relationship("ExpiryCheck", back_populates="user", cascade="all, delete-orphan")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")

# ─── DOCTOR MODEL ───────────────────────────────────────────────
class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    specialization = Column(String(100), nullable=False)
    license_number = Column(String(100), nullable=False, unique=True)
    experience_years = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    consultation_fee = Column(Float, default=50.0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="doctor_profile")

# ─── APPOINTMENT MODEL ──────────────────────────────────────────
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    department = Column(String(100), nullable=False)
    doctor_name = Column(String(255), nullable=False)
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.PENDING)
    urgency = Column(Enum(UrgencyLevel), default=UrgencyLevel.MEDIUM)
    notes = Column(Text, nullable=True)
    video_link = Column(String(500), nullable=True)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    consultation_fee = Column(Float, default=50.0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="appointments", foreign_keys=[user_id])
    doctor = relationship("User", back_populates="doctor_appointments", foreign_keys=[doctor_id])
    payment = relationship("PaymentTransaction", back_populates="appointment", uselist=False, cascade="all, delete-orphan")

# ─── MEDICATION MODEL ───────────────────────────────────────────
class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    time_slots = Column(JSON, nullable=True)
    taken_today = Column(Boolean, default=False)
    start_date = Column(DateTime, server_default=func.now(), nullable=False)
    end_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="medications")

# ─── SYMPTOM MODEL ──────────────────────────────────────────────
class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symptoms = Column(Text, nullable=False)
    duration = Column(String(100), nullable=False)
    recommended_department = Column(String(100), nullable=False)
    urgency_level = Column(Enum(UrgencyLevel), default=UrgencyLevel.MEDIUM)
    analysis = Column(Text, nullable=False)
    advice = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="symptoms")

# ─── EMERGENCY CONTACT MODEL ────────────────────────────────────
class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    relation = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="emergency_contacts")

# ─── PAYMENT TRANSACTION MODEL ──────────────────────────────────
class PaymentTransaction(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, unique=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    payment_method = Column(String(50), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    transaction_id = Column(String(255), unique=True, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="payments")
    appointment = relationship("Appointment", back_populates="payment")

# ─── NUTRITION PLAN MODEL ───────────────────────────────────────
class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    plan_type = Column(String(100), nullable=False)
    meals = Column(JSON, nullable=True)
    nutrients = Column(JSON, nullable=True)
    duration_days = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="nutrition_plans")

# ─── CHAT HISTORY MODEL ─────────────────────────────────────────
class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    message_type = Column(String(50), nullable=False)  # user, bot
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="chat_history")

# ─── NOTIFICATION MODEL ─────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.SYSTEM)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    link = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="notifications")

# ─── EXPIRY CHECK MODEL ─────────────────────────────────────────
class ExpiryCheck(Base):
    __tablename__ = "expiry_checks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    batch_code = Column(String(100), nullable=False)
    expiry_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)  # Safe, Expired
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="expiry_checks")

# ─── OPTIONAL: ACTIVITY LOG MODEL ───────────────────────────────
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("User")

# ─── OPTIONAL: DEPARTMENT MODEL ─────────────────────────────────
class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)



# ─── NUTRITION MODELS ───────────────────────────────────────────
class PatientType(Base):
    __tablename__ = "patient_types"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    description = Column(Text)
    general_advice = Column(Text)

class MealCategory(Base):
    __tablename__ = "meal_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))

class FoodItem(Base):
    __tablename__ = "food_items"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    category = Column(String(50))
    is_allowed = Column(Boolean, default=True)

class PatientTypeFoodRestriction(Base):
    __tablename__ = "patient_type_food_restrictions"
    id = Column(Integer, primary_key=True)
    patient_type_id = Column(Integer, ForeignKey("patient_types.id"))
    food_item_id = Column(Integer, ForeignKey("food_items.id"))
    restriction_type = Column(String(20))  # "avoid", "limit", "allowed"

class MealPlan(Base):
    __tablename__ = "meal_plans"
    id = Column(Integer, primary_key=True)
    patient_type_id = Column(Integer, ForeignKey("patient_types.id"))
    title = Column(String(255))
    description = Column(Text)
    meals = Column(JSON)  # structured as { "breakfast": [...], "lunch": [...], "dinner": [...] }
    created_at = Column(DateTime, server_default=func.now())