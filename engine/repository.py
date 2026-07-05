# engine/repository.py
import json
from pathlib import Path
from schema import MSMEDataPayload
from fastapi import HTTPException

# Path to the static JSON file
DATA_FILE = Path(__file__).parent / "data/mock-merchants.json"

def _load_database():
    """Simulates a database connection by loading the JSON file."""
    if not DATA_FILE.exists():
        raise FileNotFoundError("Database file mock-merchants.json not found.")
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def get_all_merchants_summary() -> list[dict]:
    """
    Used for Page 1 of the frontend: Returns a lightweight list of merchants.
    PHASE 2 CHANGE: Replace this logic with `SELECT merchant_id, business_name FROM msme_table`
    """
    data = _load_database()
    return [{"merchant_id": m["merchant_id"], "business_name": m["business_name"]} for m in data]

def get_merchant_data_by_id(merchant_id: str) -> MSMEDataPayload:
    """
    Used for Page 2 of the frontend: Retrieves full details for scoring.
    PHASE 2 CHANGE: Replace this logic with `SELECT * FROM msme_table WHERE id = merchant_id`
    """
    data = _load_database()
    
    for merchant_record in data:
        if merchant_record["merchant_id"] == merchant_id:
            # We pass the raw dictionary into Pydantic to ensure it is valid
            return MSMEDataPayload(**merchant_record)
            
    # If the loop finishes without returning, the ID wasn't found
    raise HTTPException(status_code=404, detail=f"Merchant with ID {merchant_id} not found in database.")