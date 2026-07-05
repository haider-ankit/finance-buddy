# engine/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schema import HealthScoreOutput
from scorer import calculate_health_score
import repository  # Import the new data access layer

app = FastAPI(
    title="FinanceBuddy MSME Health Engine API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Kept open for local network testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoint for Page 1 (The Directory) ---
@app.get("/api/v1/merchants", tags=["Directory"])
def get_merchant_directory():
    """Returns a list of all available merchants to populate the UI selection screen."""
    try:
        return repository.get_all_merchants_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Endpoint for Page 2 (The Health Card) ---
@app.get("/api/v1/health-card/{merchant_id}", response_model=HealthScoreOutput, tags=["Scoring"])
def get_health_card(merchant_id: str):
    """
    Retrieves a specific merchant from the database (JSON) and calculates their health score.
    """
    # Step 1: Fetch validated raw data from the repository
    raw_profile = repository.get_merchant_data_by_id(merchant_id)
    
    # Step 2: Pass the data into our scoring algorithm (Unchanged)
    final_score_output = calculate_health_score(raw_profile)
    
    # Step 3: Return the final JSON contract
    return final_score_output