from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import our custom modules
from schema import HealthScoreOutput
from mock_data_adapter import generate_msme_profile
from scorer import calculate_health_score

app = FastAPI(
    title="FinanceBuddy MSME Health Engine API",
    description="Local scoring engine for the IDBI Innovate Hackathon prototype.",
    version="1.0.0"
)

# --- CORS Configuration ---
# This is required so your Next.js frontend (running on port 3000) 
# is allowed to fetch data from this Python API (running on port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---

@app.get("/", tags=["System"])
def read_root():
    return {"status": "online", "message": "FinanceBuddy Engine is running."}

@app.get("/api/v1/health-card/{profile_type}", response_model=HealthScoreOutput, tags=["Scoring"])
def get_health_card(profile_type: str):
    """
    Generates a synthetic MSME profile and calculates its multidimensional health score.
    Valid profiles: 'healthy', 'high_risk'
    """
    valid_profiles = ["healthy", "high_risk"]
    if profile_type not in valid_profiles:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid profile type. Must be one of: {', '.join(valid_profiles)}"
        )
    
    try:
        # Step 1: Generate the raw mock data on the fly (validated by Pydantic)
        mock_msme_data = generate_msme_profile(profile_type=profile_type)
        
        # Step 2: Pass the validated data into our scoring algorithm
        final_score_output = calculate_health_score(mock_msme_data)
        
        # Step 3: Return the final JSON contract
        return final_score_output
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))