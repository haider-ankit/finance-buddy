# engine/generate_static_data.py
import json
from mock_data_adapter import generate_msme_profile

def generate_and_save():
    merchants = []
    # Generate 10 healthy and 10 high-risk profiles
    for _ in range(10):
        merchants.append(generate_msme_profile("healthy").model_dump())
    for _ in range(10):
        merchants.append(generate_msme_profile("high_risk").model_dump())
        
    with open("data/mock-merchants.json", "w") as f:
        json.dump(merchants, f, indent=2, default=str)
    print("Successfully generated data/mock-merchants.json with 20 profiles.")

if __name__ == "__main__":
    generate_and_save()