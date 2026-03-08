import type { ApiResponse, Tariff } from '../types/index.ts';
import { apiRequest } from './client.ts';

/**
 * Get all tariffs/contracts for the current user
 */
export async function getTariffs(): Promise<ApiResponse<Tariff[]>> {
  return apiRequest<Tariff[]>('/portings/mobile');
}
