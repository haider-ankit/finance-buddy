// dashboard/services/api.ts
import { HealthScoreOutput } from '../types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1'; // Fallback for server-side rendering
};

export interface MerchantSummary {
  merchant_id: string;
  business_name: string;
}

export async function fetchMerchantList(): Promise<MerchantSummary[]> {
  const response = await fetch(`${getBaseUrl()}/merchants`);
  if (!response.ok) throw new Error('Failed to fetch merchant directory');
  return response.json();
}

export async function fetchHealthCardById(merchantId: string): Promise<HealthScoreOutput> {
  const response = await fetch(`${getBaseUrl()}/health-card/${merchantId}`);
  if (!response.ok) throw new Error('Failed to fetch health profile');
  return response.json();
}