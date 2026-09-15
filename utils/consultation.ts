/**
 * Consultation pricing — single source of truth for the booking UI.
 * Mirrors backend/utils/consultationPricing.js (prices in EUR).
 */
export type ConsultationDuration = '60' | '120' | '180'

export interface ConsultationOption {
  duration: ConsultationDuration
  price: number
  recommended?: boolean
}

export const CONSULTATION_OPTIONS: ConsultationOption[] = [
  { duration: '60', price: 100, recommended: true },
  { duration: '120', price: 200 },
  { duration: '180', price: 300 },
]

export const DEFAULT_CONSULTATION_DURATION: ConsultationDuration = '60'
