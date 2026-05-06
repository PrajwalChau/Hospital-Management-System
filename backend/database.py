import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv
import models

# Load environment variables from .env file
load_dotenv()

# Defaulting to a local MongoDB instance. 
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/nepalmed")

async def init_db():
    # Patch Motor for Beanie compatibility
    if not hasattr(AsyncIOMotorClient, "append_metadata"):
        AsyncIOMotorClient.append_metadata = lambda *args, **kwargs: None
        
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.get_database("nepalmed")
    await init_beanie(
        database=db,
        document_models=[
            models.User,
            models.Hospital,
            models.Doctor,
            models.Appointment,
            models.Admission
        ]
    )
