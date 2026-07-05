// src/services/api.ts
import { HealthScoreOutput } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function fetchHealthCard(profileType: 'healthy' | 'high_risk'): Promise<HealthScoreOutput> {
  const response = await fetch(`${API_BASE_URL}/health-card/${profileType}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch MSME health profile');
  }
  
  return response.json();
}