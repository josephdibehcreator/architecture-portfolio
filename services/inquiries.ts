/**
 * Inquiry API service
 * Handles all API calls related to project inquiries
 */

import { get, post, put, ApiResponse, getApiBaseUrl } from './api'

export interface Inquiry {
  _id?: string
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
  status?: 'draft' | 'submitted' | 'confirmed' | 'booking_conflict' | 'cancelled'
  stripeSessionId?: string
  stripeCustomerId?: string
  stripeInvoiceId?: string
  invoiceStatus?: 'none' | 'pending' | 'processing' | 'billing_pending' | 'finalized' | 'failed'
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded'
  billingCollectedAt?: string
  invoiceSentAt?: string | null
  hostedInvoiceUrl?: string | null
  invoicePdfUrl?: string | null
  invoiceDeliveryMode?: 'checkout_invoice_creation' | 'legacy_manual' | null
  invoiceEmail?: string | null
  businessBilling?: {
    companyName: string
    address: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
      country: string
    }
    vatNumber?: string | null
    siret?: string | null
    collectedAt?: string
  }
  lastInvoiceError?: any | null
  missingBilling?: {
    companyName?: boolean
    taxId?: boolean
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateInquiryIdentityData {
  clientType: 'private' | 'business'
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface UpdateInquiryContextData {
  address?: string
  selectedServices?: string[]
  budget?: string
  timeline?: 'asap' | '3m' | '6m' | '1y'
  surface?: string
  description?: string
  documents?: File[]
}

export interface UpdateInquiryPathData {
  selectedPath: 'general' | 'consult'
}

export interface UpdateConsultationDetailsData {
  duration: string
  roadmapReport: boolean
  format: 'online' | 'onsite'
  selectedDate: string
  selectedTime: string
  billingInfo?: any
}

/**
 * Create inquiry identity (Step 1)
 */
export async function createInquiryIdentity(
  data: CreateInquiryIdentityData
): Promise<ApiResponse<Inquiry>> {
  return post<Inquiry>('/inquiries', data)
}

/**
 * Update inquiry context (Step 2)
 */
export async function updateInquiryContext(
  inquiryId: string,
  data: UpdateInquiryContextData
): Promise<ApiResponse<Inquiry>> {
  const formData = new FormData()
  
  if (data.address) formData.append('address', data.address)
  if (data.selectedServices) {
    data.selectedServices.forEach(service => {
      formData.append('selectedServices', service)
    })
  }
  if (data.budget) formData.append('budget', data.budget)
  if (data.timeline) formData.append('timeline', data.timeline)
  if (data.surface) formData.append('surface', data.surface)
  if (data.description) formData.append('description', data.description)
  
  if (data.documents && data.documents.length > 0) {
    data.documents.forEach(file => {
      formData.append('documents', file)
    })
  }

  // Use centralized API base URL from api.ts for FormData uploads
  const API_BASE_URL = getApiBaseUrl()

  try {
    const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/context`, {
      method: 'PUT',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
        error: result.error || result.message,
      }
    }

    return {
      success: true,
      data: result.data || result,
      message: result.message,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Update inquiry path (Step 3)
 */
export async function updateInquiryPath(
  inquiryId: string,
  data: UpdateInquiryPathData
): Promise<ApiResponse<Inquiry>> {
  return put<Inquiry>(`/inquiries/${inquiryId}/path`, data)
}

/**
 * Submit general inquiry (Step 4 - General)
 */
export async function submitGeneralInquiry(
  inquiryId: string
): Promise<ApiResponse<Inquiry>> {
  return post<Inquiry>(`/inquiries/${inquiryId}/submit`, {})
}

/**
 * Update consultation details (Step 4 - Consultation)
 */
export async function updateConsultationDetails(
  inquiryId: string,
  data: UpdateConsultationDetailsData
): Promise<ApiResponse<Inquiry>> {
  return put<Inquiry>(`/inquiries/${inquiryId}/consultation`, data)
}

/**
 * Get inquiry by ID
 */
export async function getInquiryById(
  inquiryId: string
): Promise<ApiResponse<Inquiry>> {
  return get<Inquiry>(`/inquiries/${inquiryId}`)
}

/**
 * Check if a date/time slot is available
 */
export async function checkDateAvailability(
  date: string,
  time: string,
  excludeInquiryId?: string
): Promise<ApiResponse<{ available: boolean; date: string; time: string }>> {
  const params = new URLSearchParams({ date, time })
  if (excludeInquiryId) {
    params.append('excludeInquiryId', excludeInquiryId)
  }
  return get<{ available: boolean; date: string; time: string }>(`/inquiries/check-availability?${params.toString()}`)
}

/**
 * Get all booked date/time slots
 */
export async function getBookedSlots(): Promise<ApiResponse<Array<{ date: string; time: string; confirmed: boolean }>>> {
  return get<Array<{ date: string; time: string; confirmed: boolean }>>('/inquiries/booked-slots')
}

export interface SubmitBillingInfoData {
  companyName: string
  address: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country?: string
  }
  vatNumber?: string
  /** French company ID: SIREN (9 digits) or SIRET (14 digits). Optional, only for country FR. */
  siret?: string
}

export interface SaveBusinessBillingData extends SubmitBillingInfoData {}

export interface SubmitBillingInfoResult {
  customerId?: string | null
  invoiceId?: string | null
  invoiceStatus?: string | null
  inquiryInvoiceStatus?: 'billing_pending' | 'finalized' | 'failed' | string
  billingCollectedAt?: string
  invoiceSentAt?: string | null
  hostedInvoiceUrl?: string | null
  invoicePdfUrl?: string | null
  invoiceEmail?: string | null
}

/**
 * Submit billing information for business clients (post-payment)
 * Uses the dedicated billing endpoint. Server derives customer/invoice IDs.
 */
export async function submitBillingInfo(
  inquiryId: string,
  sessionId: string | null,
  data: SubmitBillingInfoData
): Promise<ApiResponse<SubmitBillingInfoResult>> {
  return post<SubmitBillingInfoResult>(`/billing/business`, {
    inquiryId,
    sessionId: sessionId || undefined,
    ...data
  })
}

/**
 * Save business billing details before Checkout (new business flow)
 */
export async function saveBusinessBilling(
  inquiryId: string,
  data: SaveBusinessBillingData
): Promise<ApiResponse<Inquiry>> {
  return put<Inquiry>(`/inquiries/${inquiryId}/business-billing`, data)
}

export default {
  createInquiryIdentity,
  updateInquiryContext,
  updateInquiryPath,
  submitGeneralInquiry,
  updateConsultationDetails,
  getInquiryById,
  submitBillingInfo,
  saveBusinessBilling,
  checkDateAvailability,
  getBookedSlots,
}

