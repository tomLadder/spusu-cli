import type { ApiResponse, InvoicesResponse } from '../types/index.ts';
import { apiRequest, downloadFile } from './client.ts';

/**
 * Get all invoices for a given year (defaults to current year)
 */
export async function getInvoices(year?: number): Promise<ApiResponse<InvoicesResponse>> {
  const endpoint = year
    ? `/customerarea/invoices?year=${year}`
    : '/customerarea/invoices';
  return apiRequest<InvoicesResponse>(endpoint);
}

/**
 * Download invoice as PDF
 */
export async function downloadInvoicePdf(
  invoiceId: number,
  year: number,
  outputPath: string
): Promise<ApiResponse<string>> {
  return downloadFile(`/customerarea/invoices/${year}/id/${invoiceId}`, outputPath);
}

/**
 * Download itemised bill as Excel file
 */
export async function downloadInvoiceExcel(
  invoiceId: number,
  year: number,
  outputPath: string
): Promise<ApiResponse<string>> {
  return downloadFile(
    `/customerarea/invoices/${year}/id/${invoiceId}/itemisedbill/file`,
    outputPath
  );
}
