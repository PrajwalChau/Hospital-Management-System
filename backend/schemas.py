from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from models import RoleEnum

class UserBase(BaseModel):
    full_name: str
    email: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    is_active: bool
    kyc_verified: bool
    created_at: datetime

    class Config:
        populate_by_name = True

class HospitalBase(BaseModel):
    name: str
    city: str
    latitude: float
    longitude: float
    total_beds: int
    occupied_beds: int

class HospitalResponse(HospitalBase):
    id: str = Field(alias="_id")
    kyc_verified: bool

    class Config:
        populate_by_name = True

class AnalyticsData(BaseModel):
    total_hospitals: int
    total_beds: int
    occupied_beds: int
    occupancy_rate: float
    recent_admissions_count: int
    department_distribution: Dict[str, int]
