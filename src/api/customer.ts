import type { ApiResponse, Customer } from '../types/index.ts';
import { apiRequest } from './client.ts';

/**
 * Get current customer information
 */
export async function getCustomer(): Promise<ApiResponse<Customer>> {
  return apiRequest<Customer>('/customerarea/customer/');
}
