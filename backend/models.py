from typing import Optional, List
from datetime import datetime
import enum
from beanie import Document, Link
from pydantic import Field

class RoleEnum(str, enum.Enum):
    PATIENT = "Patient"
    DOCTOR = "Doctor"
    HOSPITAL_ADMIN = "Hospital Admin"
    SYS_ADMIN = "Admin"
    GOVERNMENT = "Government"

class User(Document):
    full_name: str
    email: str
    hashed_password: str
    role: RoleEnum = RoleEnum.PATIENT
    is_active: bool = True
    kyc_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class Hospital(Document):
    name: str
    city: str
    latitude: float
    longitude: float
    total_beds: int = 0
    occupied_beds: int = 0
    kyc_verified: bool = False
    
    class Settings:
        name = "hospitals"

class Doctor(Document):
    user: Link[User]
    hospital: Optional[Link[Hospital]] = None
    specialty: str
    nmc_number: str # Nepal Medical Council
    
    class Settings:
        name = "doctors"

class Appointment(Document):
    patient: Link[User]
    doctor: Link[Doctor]
    appointment_time: datetime
    status: str = "Scheduled" # Scheduled, Completed, Cancelled
    
    class Settings:
        name = "appointments"

class Admission(Document):
    hospital: Link[Hospital]
    patient: Link[User]
    admission_date: datetime = Field(default_factory=datetime.utcnow)
    discharge_date: Optional[datetime] = None
    department: str # e.g., General, ICU, Maternity
    
    class Settings:
        name = "admissions"
