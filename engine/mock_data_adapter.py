import random
from datetime import datetime, timedelta
from faker import Faker
from schema import UPITransaction, GSTRecord, EPFORecord, MSMEDataPayload

fake = Faker('en_IN') # Localized to India for realistic names/cities

def generate_upi_data(merchant_id: str, profile_type: str, months: int = 6) -> list[UPITransaction]:
    transactions = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30 * months)
    
    # Simulate a small pool of regular customers vs random walk-ins
    regular_vpas = [f"{fake.user_name()}@okaxis" for _ in range(5)]
    
    # 1. GENERATE "HEALTHY" PROFILE
    if profile_type == "healthy":
        num_transactions = random.randint(150, 300) # High velocity
        for _ in range(num_transactions):
            tx_time = fake.date_time_between(start_date=start_date, end_date=end_date)
            # Normal distribution of transaction amounts (e.g., retail store)
            amount = round(random.uniform(50.0, 2500.0), 2)
            vpa = random.choice(regular_vpas) if random.random() < 0.3 else f"{fake.user_name()}@ybl"
            
            transactions.append(
                UPITransaction(
                    transaction_id=fake.uuid4(),
                    timestamp=tx_time,
                    amount=amount,
                    type="CREDIT",
                    counterparty_vpa=vpa
                )
            )
            
    # 2. GENERATE "FRAUD / WASH TRADING" PROFILE
    elif profile_type == "high_risk":
        num_transactions = random.randint(20, 40) # Low velocity, but high amounts
        fraud_vpa = f"{fake.user_name()}@sbi" # Single counterparty doing the wash trading
        for _ in range(num_transactions):
            # Clustered late-night transactions
            tx_time = fake.date_time_between(start_date=start_date, end_date=end_date).replace(hour=23, minute=random.randint(10,50))
            # Suspiciously round, large numbers
            amount = float(random.choice([10000, 25000, 50000]))
            
            transactions.append(
                UPITransaction(
                    transaction_id=fake.uuid4(),
                    timestamp=tx_time,
                    amount=amount,
                    type="CREDIT",
                    counterparty_vpa=fraud_vpa # High VPA concentration
                )
            )
            
    return transactions

def generate_gst_data(profile_type: str, months: int = 6) -> list[GSTRecord]:
    gst_records = []
    for m in range(months):
        month_str = (datetime.now() - timedelta(days=30 * m)).strftime("%Y-%m")
        
        if profile_type == "healthy":
            turnover = round(random.uniform(200000.0, 500000.0), 2)
            status = "ON_TIME" if random.random() < 0.9 else "LATE" # Mostly on time
        elif profile_type == "high_risk":
            turnover = round(random.uniform(0.0, 50000.0), 2)
            status = random.choice(["LATE", "MISSED", "ON_TIME"]) # Erratic compliance
            
        gst_records.append(
            GSTRecord(
                month=month_str,
                declared_turnover=turnover,
                tax_paid=round(turnover * 0.18, 2), # Assuming 18% GST slab
                filing_status=status
            )
        )
    return gst_records

def generate_msme_profile(profile_type: str = "healthy") -> MSMEDataPayload:
    """
    Main orchestrator function. Generates a complete MSME profile 
    and validates it against our Pydantic schema contract.
    """
    merchant_id = f"MERCH_{fake.ean(length=8)}"
    business_name = f"{fake.company()} {random.choice(['Enterprises', 'Traders', 'Technologies'])}"
    
    raw_data = {
        "merchant_id": merchant_id,
        "business_name": business_name,
        "upi_data": generate_upi_data(merchant_id, profile_type),
        "gst_data": generate_gst_data(profile_type),
        "epfo_data": [] # Can be built out later if needed
    }
    
    # This line is the magic. It feeds the raw dict into Pydantic.
    # If anything is wrong, it instantly throws a validation error.
    validated_profile = MSMEDataPayload(**raw_data)
    
    return validated_profile

# --- Quick Test ---
if __name__ == "__main__":
    # Generate a profile and print it as JSON
    test_profile = generate_msme_profile("high_risk")
    print(test_profile.model_dump_json(indent=2))