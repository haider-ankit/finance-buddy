from schema import MSMEDataPayload, HealthScoreOutput, ScoreMetrics, RiskFlag

def calculate_health_score(profile: MSMEDataPayload) -> HealthScoreOutput:
    """
    Takes a validated MSME profile, analyzes UPI and GST behaviors,
    and returns a final HealthScoreOutput.
    """
    risk_flags = []
    strengths = []
    
    # --- 1. UPI VELOCITY & FRAUD CHECK ---
    total_upi_volume = sum(tx.amount for tx in profile.upi_data)
    unique_vpas = set(tx.counterparty_vpa for tx in profile.upi_data)
    
    # Calculate concentration (Is one person making all the transactions?)
    if len(profile.upi_data) > 0:
        vpa_ratio = len(unique_vpas) / len(profile.upi_data)
    else:
        vpa_ratio = 0

    upi_score = 0
    if vpa_ratio < 0.1 and len(profile.upi_data) > 10:
        # High concentration means potential wash trading
        upi_score = 20
        risk_flags.append(
            RiskFlag(
                severity="CRITICAL", 
                category="Wash Trading Risk", 
                description="High concentration of transactions from a small number of counterparties."
            )
        )
    else:
        # Healthy distribution
        upi_score = min(100, int((total_upi_volume / 50000) * 100)) # Simple scale
        if upi_score > 70:
            strengths.append("Strong and diversified daily UPI cash flow.")

    # --- 2. GST COMPLIANCE CHECK ---
    late_filings = sum(1 for record in profile.gst_data if record.filing_status == "LATE")
    missed_filings = sum(1 for record in profile.gst_data if record.filing_status == "MISSED")
    
    gst_score = 100
    if missed_filings > 0:
        gst_score -= (missed_filings * 30)
        risk_flags.append(
            RiskFlag(
                severity="HIGH", 
                category="Tax Compliance", 
                description=f"Missed {missed_filings} GST filings in the last 6 months."
            )
        )
    if late_filings > 0:
        gst_score -= (late_filings * 10)
        
    if gst_score == 100:
        strengths.append("Perfect GST filing record over the last 6 months.")

    # --- 3. FINAL AGGREGATION ---
    # Give UPI 60% weight (real-time cash) and GST 40% weight (historical compliance)
    overall_score = int(((upi_score * 0.6) + (gst_score * 0.4)) * 10) 
    
    # Simple Decision Engine
    decision = "MANUAL_REVIEW"
    # if overall_score > 750 and not any(flag.severity == "CRITICAL" for flag in risk_flags):
    #     decision = "APPROVED"
    # elif overall_score < 400 or any(flag.severity == "CRITICAL" for flag in risk_flags):
    #     decision = "REJECTED"

    return HealthScoreOutput(
        merchant_id=profile.merchant_id,
        business_name=profile.business_name,
        overall_health_score=overall_score,
        credit_decision=decision,
        metrics=ScoreMetrics(
            upi_velocity_score=upi_score,
            gst_compliance_score=gst_score,
            epfo_stability_score=0 # Placeholder for future implementation
        ),
        risk_flags=risk_flags,
        strengths=strengths
    )