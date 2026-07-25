/**
 * Admin Inquiries API service
 * Handles all API calls related to inquiry management (admin only)
 */

import { get, patch, del, ApiResponse, getApiBaseUrl } from '../api'

export interface Inquiry {
  _id: string
  clientType: 'private' | 'business'
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  selectedServices?: string[]
  budget?: string
  timeline?: 'asap' | '3m' | '6m' | '1y'
  surface?: string
  description?: string
  documentUrls?: string[]
  selectedPath?: 'general' | 'consult'
  consultationDetails?: {
    duration?: string
    roadmapReport?: boolean
    format?: 'online' | 'onsite'
    selectedDate?: string
    selectedTime?: string
  }
  step?: number
  status?: 'draft' | 'submitted' | 'reviewed' | 'consultation_pending_payment' | 'payment_pending' | 'paid' | 'invoice_finalized' | 'completed' | 'cancelled'
  stripeSessionId?: string
  stripeCustomerId?: string
  stripeInvoiceId?: string
  invoiceStatus?: 'pending' | 'billing_pending' | 'finalized'
  paymentStatus?: 'pending' | 'paid'
  billingCollectedAt?: string
  submittedAt?: string
  paidAt?: string
  reviewedAt?: string
  reviewedBy?: {
    id: string
    email: string
  }
  adminNotes?: Array<{
    text: string
    author: {
      id: string
      email: string
    }
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

export interface ListInquiriesParams {
  page?: number
  limit?: number
  q?: string
  status?: string
  clientType?: string
  service?: string
  paymentStatus?: string
  invoiceStatus?: string
  selectedPath?: string
  dateFrom?: string
  dateTo?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListInquiriesResponse {
  data: Inquiry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    statuses: string[]
    services: string[]
  }
}

export interface UpdateInquiryStatusData {
  status?: string
  adminNote?: string
}

/**
 * List inquiries (admin)
 */
export async function listInquiries(
  params: ListInquiriesParams = {}
): Promise<ApiResponse<ListInquiriesResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.q) queryParams.append('q', params.q)
  if (params.status && params.status !== 'all') queryParams.append('status', params.status)
  if (params.clientType && params.clientType !== 'all') queryParams.append('clientType', params.clientType)
  if (params.service) queryParams.append('service', params.service)
  if (params.paymentStatus && params.paymentStatus !== 'all') queryParams.append('paymentStatus', params.paymentStatus)
  if (params.invoiceStatus && params.invoiceStatus !== 'all') queryParams.append('invoiceStatus', params.invoiceStatus)
  if (params.selectedPath && params.selectedPath !== 'all') queryParams.append('selectedPath', params.selectedPath)
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom)
  if (params.dateTo) queryParams.append('dateTo', params.dateTo)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<ListInquiriesResponse>(`/admin/inquiries${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get a single inquiry by ID (admin)
 */
export async function getInquiry(id: string): Promise<ApiResponse<Inquiry>> {
  return get<Inquiry>(`/admin/inquiries/${id}`)
}

/**
 * Update inquiry status (admin)
 */
export async function updateInquiryStatus(
  id: string,
  data: UpdateInquiryStatusData
): Promise<ApiResponse<Inquiry>> {
  return patch<Inquiry>(`/admin/inquiries/${id}/status`, data)
}

/**
 * Bulk update inquiry status (admin)
 */
export async function bulkUpdateInquiryStatus(
  ids: string[],
  status: string
): Promise<ApiResponse<{ matchedCount: number; modifiedCount: number }>> {
  return patch<{ matchedCount: number; modifiedCount: number }>('/admin/inquiries/bulk-status', {
    ids,
    status
  })
}

/**
 * Delete inquiry (admin)
 */
export async function deleteInquiry(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/inquiries/${id}`)
}

export default {
  listInquiries,
  getInquiry,
  updateInquiryStatus,
  bulkUpdateInquiryStatus,
  deleteInquiry
}
