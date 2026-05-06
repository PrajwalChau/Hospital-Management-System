import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie, Document
from pydantic import Field
from faker import Faker
import random
from datetime import datetime, timedelta

# Localized Nepali Data
NEPALI_CITIES = [
    "Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", 
    "Birgunj", "Butwal", "Dharan", "Bhimdatta", "Dhangadhi", "Itahari"
]

HOSPITAL_NAMES = [
    "Bir Hospital", "Tribhuvan University Teaching Hospital", "Patan Hospital",
    "Norvic International Hospital", "Grande International Hospital", 
    "Mediciti Hospital", "HAMS Hospital", "Neuro Hospital", "Kanti Children's Hospital",
    "Shahid Gangalal National Heart Center", "Tilganga Institute of Ophthalmology"
]

DEPARTMENTS = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine", "Emergency", "Maternity", "Oncology"]

# Models (simplified version of backend/models.py but using Beanie)
class User(Document):
    full_name: str
    email: str
    password_hash: str
    role: str # 'Patient', 'Doctor', 'Hospital', 'Admin', 'Gov'
    is_verified: bool = False

class Hospital(Document):
    name: str
    city: str
    lat: float
    lng: float
    total_beds: int
    occupied_beds: int
    user_id: str # Reference to User ID

class Doctor(Document):
    full_name: str
    specialty: str
    nmc_number: str
    hospital_id: str # Reference to Hospital ID
    user_id: str # Reference to User ID

class Appointment(Document):
    patient_id: str
    doctor_id: str
    appointment_date: datetime
    status: str = "scheduled"

class Admission(Document):
    hospital_id: str
    patient_id: str
    department: str
    admission_date: datetime
    discharge_date: datetime = None

async def seed():
    # Patch Motor for Beanie compatibility
    if not hasattr(AsyncIOMotorClient, "append_metadata"):
        AsyncIOMotorClient.append_metadata = lambda *args, **kwargs: None
        
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
    db = client["nepalmed"]
    await init_beanie(database=db, document_models=[User, Hospital, Doctor, Appointment, Admission])
    
    fake = Faker()
    
    # Clear existing data
    await User.find_all().delete()
    await Hospital.find_all().delete()
    await Doctor.find_all().delete()
    await Appointment.find_all().delete()
    await Admission.find_all().delete()
    
    print("🌱 Seeding NepalMed MongoDB...")
    
    # 1. Create Admin & Gov users
    admin = User(full_name="System Admin", email="admin@nepalmed.gov.np", password_hash="hashed", role="Admin", is_verified=True)
    gov = User(full_name="Ministry official", email="official@mohp.gov.np", password_hash="hashed", role="Gov", is_verified=True)
    await admin.insert()
    await gov.insert()
    
    # 2. Create Hospitals
    hospitals = []
    for name in HOSPITAL_NAMES:
        h_user = User(full_name=f"{name} Admin", email=f"admin@{name.lower().replace(' ', '')}.com", password_hash="hashed", role="Hospital", is_verified=True)
        await h_user.insert()
        
        h = Hospital(
            name=name,
            city=random.choice(NEPALI_CITIES),
            lat=27.7 + random.uniform(-0.1, 0.1),
            lng=85.3 + random.uniform(-0.1, 0.1),
            total_beds=random.randint(50, 500),
            occupied_beds=random.randint(20, 450),
            user_id=str(h_user.id)
        )
        await h.insert()
        hospitals.append(h)
        
    # 3. Create Doctors
    doctors = []
    for i in range(50):
        d_user = User(full_name=fake.name(), email=fake.email(), password_hash="hashed", role="Doctor", is_verified=True)
        await d_user.insert()
        
        h = random.choice(hospitals)
        d = Doctor(
            full_name=d_user.full_name,
            specialty=random.choice(DEPARTMENTS),
            nmc_number=f"NMC-{random.randint(10000, 99999)}",
            hospital_id=str(h.id),
            user_id=str(d_user.id)
        )
        await d.insert()
        doctors.append(d)
        
    # 4. Create Patients & Admissions
    for i in range(100):
        p_user = User(full_name=fake.name(), email=fake.email(), password_hash="hashed", role="Patient", is_verified=True)
        await p_user.insert()
        
        # Some are admitted
        if random.random() > 0.5:
            h = random.choice(hospitals)
            adm = Admission(
                hospital_id=str(h.id),
                patient_id=str(p_user.id),
                department=random.choice(DEPARTMENTS),
                admission_date=datetime.now() - timedelta(days=random.randint(1, 30))
            )
            await adm.insert()
            
    print(f"✅ Seeded {len(hospitals)} hospitals, {len(doctors)} doctors, and 100+ patients.")

if __name__ == "__main__":
    asyncio.run(seed())
