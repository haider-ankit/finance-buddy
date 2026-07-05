from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

# ---------------------------------------------------------
# 1. INPUT SCHEMAS (The Idealized DPI Data)
# ---------------------------------------------------------

class UPITransaction(BaseModel):
    transaction_id: str
    timestamp: datetime  # Upgraded from 'date' to catch time anomalies
    amount: float
    type: str = Field(..., pattern="^(CREDIT|DEBIT)$")
    counterparty_vpa: str  # Added to track unique customers vs. circular transfers

class GSTRecord(BaseModel):
    month: str  # Format: YYYY-MM
    declared_turnover: float
    tax_paid: float
    filing_status: str = Field(..., pattern="^(ON_TIME|LATE|MISSED)$")

class EPFORecord(BaseModel):
    month: str # Format: YYYY-MM
    employee_count: int
    contribution_amount: float

# This is the payload your mock data adapter will generate
class MSMEDataPayload(BaseModel):
    merchant_id: str
    business_name: str
    upi_data: List[UPITransaction]
    gst_data: List[GSTRecord]
    epfo_data: List[EPFORecord]

# ---------------------------------------------------------
# 2. OUTPUT SCHEMA (The Financial Health Card)
# ---------------------------------------------------------

class RiskFlag(BaseModel):
    severity: str = Field(..., pattern="^(LOW|MEDIUM|HIGH|CRITICAL)$")
    category: str
    description: str

class ScoreMetrics(BaseModel):
    upi_velocity_score: int
    gst_compliance_score: int
    epfo_stability_score: int

# This is the final JSON your Next.js dashboard will consume
class HealthScoreOutput(BaseModel):
    merchant_id: str
    business_name: str
    overall_health_score: int = Field(..., ge=0, le=1000)
    credit_decision: str = Field(..., pattern="^(APPROVED|MANUAL_REVIEW|REJECTED)$")
    metrics: ScoreMetrics
    risk_flags: List[RiskFlag]
    strengths: List[str]