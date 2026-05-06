import asyncio
import random
from faker import Faker
import models
import datetime
from database import init_db

fake = Faker()
# Custom providers or lists for Nepal
nepal_cities = ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Janakpur", "Hetauda", "Dharan", "Butwal", "Nepalgunj"]
specialties = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "General Surgery", "Gynecology", "Dermatology"]
departments = ["General Ward", "ICU", "Emergency", "Maternity", "Pediatrics", "Operation Theater"]

async def seed_data(num_records=500):
    await init_db()
    
    # Check if already seeded
    if await models.User.count() > 0:
        print("Database already seeded. Skipping.")
        return

    print("Seeding MongoDB database with synthetic data for NepalMed...")

    # Create Hospitals (around 20)
    hospitals = []
    for _ in range(20):
        total_beds = random.randint(50, 500)
        hosp = models.Hospital(
            name=f"{fake.company()} Hospital",
            city=random.choice(nepal_cities),
            latitude=random.uniform(26.0, 30.0),
            longitude=random.uniform(80.0, 88.0),
            total_beds=total_beds,
            occupied_beds=random.randint(0, total_beds),
            kyc_verified=random.choice([True, True, False])
        )
        await hosp.insert()
        hospitals.append(hosp)
    
    # Create Users & Doctors
    users = []
    for _ in range(num_records):
        role = random.choices(
            [models.RoleEnum.PATIENT, models.RoleEnum.DOCTOR, models.RoleEnum.HOSPITAL_ADMIN],
            weights=[80, 15, 5]
        )[0]

        user = models.User(
            full_name=fake.name(),
            email=fake.unique.email(),
            hashed_password="hashed_password", # Dummy
            role=role,
            kyc_verified=True if role != models.RoleEnum.DOCTOR else random.choice([True, False])
        )
        await user.insert()
        users.append(user)
    
    # Create Doctors linked to users and hospitals
    doctors = []
    for user in users:
        if user.role == models.RoleEnum.DOCTOR:
            doc = models.Doctor(
                user=user,
                hospital=random.choice(hospitals),
                specialty=random.choice(specialties),
                nmc_number=f"NMC-{random.randint(1000, 9999)}-{random.randint(100, 999)}"
            )
            await doc.insert()
            doctors.append(doc)
    
    # Create Admissions
    admissions = []
    patients = [u for u in users if u.role == models.RoleEnum.PATIENT]
    for _ in range(1000): # 1000 past admissions
        hospital = random.choice(hospitals)
        patient = random.choice(patients)
        
        days_ago = random.randint(0, 30)
        admit_date = datetime.datetime.utcnow() - datetime.timedelta(days=days_ago)
        
        admission = models.Admission(
            hospital=hospital,
            patient=patient,
            admission_date=admit_date,
            department=random.choice(departments)
        )
        admissions.append(admission)
    
    # Batch insert admissions for speed
    if admissions:
        await models.Admission.insert_many(admissions)

    print(f"Successfully seeded database with ~{num_records} users, hospitals, doctors, and admissions!")

if __name__ == "__main__":
    asyncio.run(seed_data())
