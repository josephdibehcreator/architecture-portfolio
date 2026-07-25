/**
 * Stripe API service
 * Handles Stripe payment operations
 */

import { post, get, ApiResponse } from './api'

export interface CreateCheckoutSessionData {
  inquiryId: string
  duration: string
  roadmapReport: boolean
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

export interface CheckoutSessionStatus {
  sessionId: string
  paymentStatus: string
  status: string
  customerEmail?: string
  amountTotal?: number
  currency?: string
  inquiryId?: string
  clientType?: string | null
  hostedInvoiceUrl?: string | null
  invoicePdfUrl?: string | null
  invoiceStatus?: string | null
  metadata?: {
    inquiryId?: string
    clientType?: string
    duration?: string
    roadmapReport?: string
  }
  customer?: string
  invoice?: string
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  data: CreateCheckoutSessionData
): Promise<ApiResponse<CheckoutSession>> {
  return post<CheckoutSession>('/stripe/create-checkout-session', data)
}

/**
 * Get checkout session status
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<ApiResponse<CheckoutSessionStatus>> {
  return get<CheckoutSessionStatus>(`/stripe/session/${sessionId}`)
}

/**
 * Verify payment status for an inquiry (manual verification if webhook failed)
 */
export async function verifyPaymentStatus(
  inquiryId: string
): Promise<ApiResponse<CheckoutSessionStatus>> {
  return get<CheckoutSessionStatus>(`/stripe/verify-payment/${inquiryId}`)
}

export default {
  createCheckoutSession,
  getCheckoutSession,
  verifyPaymentStatus,
}

