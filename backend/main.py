from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from beanie import operators

import models
import schemas
from database import init_db

app = FastAPI(title="NepalMed API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to NepalMed API (MongoDB/Beanie edition)"}

@app.get("/hospitals/", response_model=List[schemas.HospitalResponse])
async def read_hospitals(skip: int = 0, limit: int = 100):
    hospitals = await models.Hospital.find_all().skip(skip).limit(limit).to_list()
    # Beanie handles the mapping to the response model, but we need to ensure the ID mapping is correct
    return hospitals

@app.get("/analytics/government", response_model=schemas.AnalyticsData)
async def get_gov_analytics():
    total_hospitals = await models.Hospital.count()
    
    # Using aggregation for sums
    beds_stats = await models.Hospital.aggregate([
        {"$group": {
            "_id": None,
            "total_beds": {"$sum": "$total_beds"},
            "occupied_beds": {"$sum": "$occupied_beds"}
        }}
    ]).to_list()
    
    total_beds = beds_stats[0].get("total_beds", 0) if beds_stats else 0
    occupied_beds = beds_stats[0].get("occupied_beds", 0) if beds_stats else 0
    
    occupancy_rate = (occupied_beds / total_beds * 100) if total_beds > 0 else 0
    
    # Recent admissions
    recent_admissions = await models.Admission.count() 
    
    # Department distribution using aggregation
    dept_stats = await models.Admission.aggregate([
        {"$group": {
            "_id": "$department",
            "count": {"$sum": 1}
        }}
    ]).to_list()
    
    dept_dist = {item["_id"]: item["count"] for item in dept_stats if item["_id"]}

    return {
        "total_hospitals": total_hospitals,
        "total_beds": total_beds,
        "occupied_beds": occupied_beds,
        "occupancy_rate": occupancy_rate,
        "recent_admissions_count": recent_admissions,
        "department_distribution": dept_dist
    }

@app.get("/analytics/admissions_trend")
async def get_admissions_trend():
    # In a real app, we'd use aggregation to group by date
    # return await models.Admission.aggregate(...)
    return [
        {"date": "2023-10-01", "admissions": 120},
        {"date": "2023-10-02", "admissions": 132},
        {"date": "2023-10-03", "admissions": 101},
        {"date": "2023-10-04", "admissions": 145},
        {"date": "2023-10-05", "admissions": 160},
        {"date": "2023-10-06", "admissions": 150},
        {"date": "2023-10-07", "admissions": 180},
    ]
