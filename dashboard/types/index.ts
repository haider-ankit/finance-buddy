// src/types/index.ts

export interface RiskFlag {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  description: string;
}

export interface ScoreMetrics {
  upi_velocity_score: number;
  gst_compliance_score: number;
  epfo_stability_score: number;
}

export interface HealthScoreOutput {
  merchant_id: string;
  business_name: string;
  overall_health_score: number;
  credit_decision: 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';
  metrics: ScoreMetrics;
  risk_flags: RiskFlag[];
  strengths: string[];
}