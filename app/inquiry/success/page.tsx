'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { getCheckoutSession } from '@/services/stripe'
import { getInquiryById, submitBillingInfo } from '@/services/inquiries'
import Link from 'next/link'
import './InquirySuccessPage.css'

const normalizeVat = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '')
const normalizeSiretDigits = (value: string) => value.replace(/\D/g, '')
const isRetryableInvoiceStatus = (status: string | null | undefined) =>
  status === 'billing_pending' || status === 'failed'

interface BillingFormData {
  companyName: string
  address: {
    line1: string
    line2: string
    city: string
    postalCode: string
    country: string
  }
  vatNumber: string
  siret: string
}

interface BillingFormProps {
  inquiryId: string
  sessionId: string
  onSubmit: (payload?: {
    hostedInvoiceUrl?: string | null
    invoicePdfUrl?: string | null
    inquiryInvoiceStatus?: string
  }) => void
}

function BillingForm({ inquiryId, sessionId, onSubmit }: BillingFormProps) {
  const [formData, setFormData] = useState<BillingFormData>({
    companyName: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postalCode: '',
      country: 'FR'
    },
    vatNumber: '',
    siret: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null)
  const [invoicePdf, setInvoicePdf] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setInvoiceLink(null)
    setInvoicePdf(null)

    // Defensive: sessionId must be present to submit billing
    if (!sessionId) {
      setError('Missing payment session information. Please refresh this page or contact support.')
      setLoading(false)
      return
    }

    // Validate required fields
    if (!formData.companyName.trim()) {
      setError('Company name is required')
      setLoading(false)
      return
    }
    if (!formData.address.line1.trim() || !formData.address.city.trim() || !formData.address.postalCode.trim()) {
      setError('Complete billing address is required')
      setLoading(false)
      return
    }

    // Optional SIRET/SIREN: if provided (France only), must be 9 (SIREN) or 14 (SIRET) digits
    if (formData.address.country === 'FR' && formData.siret.trim()) {
      const digitsOnly = normalizeSiretDigits(formData.siret)
      if (digitsOnly.length !== 9 && digitsOnly.length !== 14) {
        setError('SIRET/SIREN must be 9 digits (SIREN) or 14 digits (SIRET)')
        setLoading(false)
        return
      }
    }

    try {
      const result = await submitBillingInfo(
        inquiryId,
        sessionId,
        {
          companyName: formData.companyName.trim(),
          address: {
            line1: formData.address.line1.trim(),
            line2: formData.address.line2.trim() || undefined,
            city: formData.address.city.trim(),
            postalCode: formData.address.postalCode.trim(),
            country: (formData.address.country || 'FR').toUpperCase()
          },
          vatNumber: formData.vatNumber.trim() ? normalizeVat(formData.vatNumber) : undefined,
          siret: formData.address.country === 'FR' && formData.siret.trim()
            ? normalizeSiretDigits(formData.siret).trim()
            : undefined
        }
      )

      if (result.success) {
        const hosted = (result.data as any)?.hostedInvoiceUrl || null
        const pdf = (result.data as any)?.invoicePdfUrl || null
        setInvoiceLink(hosted)
        setInvoicePdf(pdf)
        onSubmit({
          hostedInvoiceUrl: hosted,
          invoicePdfUrl: pdf,
          inquiryInvoiceStatus: (result.data as any)?.inquiryInvoiceStatus
        })
      } else {
        setError(result.message || 'Failed to submit billing information')
      }
    } catch (err) {
      console.error('Error submitting billing info:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="billing-form" onSubmit={handleSubmit}>
      <h2>Business Billing Information</h2>
      <p className="form-intro">
        Payment received. Please provide your billing details so we can issue and send your business invoice.
      </p>

      {error && (
        <div className="billing-form-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="billing-field">
        <label>
          Company Name <span className="required">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Your Company Name"
        />
      </div>

      <div className="billing-field">
        <label>
          Billing Address Line 1 <span className="required">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.address.line1}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
          placeholder="Street address"
        />
      </div>

      <div className="billing-field">
        <label>Address Line 2 (optional)</label>
        <input
          type="text"
          value={formData.address.line2}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line2: e.target.value } })}
          placeholder="Apartment, suite, etc."
        />
      </div>

      <div className="city-postal">
        <div className="billing-field">
          <label>
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.address.city}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            placeholder="City"
          />
        </div>
        <div className="billing-field">
          <label>
            Postal Code <span className="required">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.address.postalCode}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
            placeholder="75001"
          />
        </div>
      </div>

      <div className="billing-field">
        <label>Country</label>
        <select
          value={formData.address.country}
          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
        >
          <option value="FR">France</option>
          <option value="BE">Belgium</option>
          <option value="DE">Germany</option>
          <option value="ES">Spain</option>
          <option value="IT">Italy</option>
          <option value="NL">Netherlands</option>
          <option value="GB">United Kingdom</option>
        </select>
      </div>

      <div className={`billing-field ${formData.address.country !== 'FR' ? 'mb-lg' : ''}`}>
        <label>VAT Number (optional)</label>
        <input
          type="text"
          value={formData.vatNumber}
          onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
          placeholder="FR12345678901"
        />
        <p className="field-hint">EU VAT number if applicable</p>
      </div>

      {formData.address.country === 'FR' && (
        <div className="billing-field mb-lg">
          <label>SIRET / SIREN (optional, recommended for French companies)</label>
          <input
            type="text"
            inputMode="numeric"
            value={formData.siret}
            onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
            placeholder="123 456 789 01234"
            maxLength={20}
          />
          <p className="field-hint">
            French company identification: SIREN (9 digits) or SIRET (14 digits). Helps with invoicing compliance.
          </p>
        </div>
      )}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Billing Information'}
      </button>

      {(invoiceLink || invoicePdf) && (
        <div className="billing-form-success" style={{ marginTop: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            Invoice generated successfully. You can access it here:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {invoiceLink && (
              <a className="btn-secondary" href={invoiceLink} target="_blank" rel="noreferrer">
                Open hosted invoice
              </a>
            )}
            {invoicePdf && (
              <a className="btn-secondary" href={invoicePdf} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            )}
          </div>
        </div>
      )}
    </form>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [inquiry, setInquiry] = useState<any>(null)
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [billingSubmitted, setBillingSubmitted] = useState(false)
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null)
  const [invoicePdf, setInvoicePdf] = useState<string | null>(null)
  const [billingRetryable, setBillingRetryable] = useState(false)
  const [invoicePendingRefreshHint, setInvoicePendingRefreshHint] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        // Source of truth: Stripe session (available immediately after redirect).
        // Do NOT rely on inquiry status—webhook is async and may not have run yet.
        const result = await getCheckoutSession(sessionId)

        if (result.success && result.data) {
          const data = result.data
          setSessionData(data)
          setPaymentStatus(data.paymentStatus)

          const clientTypeFromSession =
            (data as any).clientType || data.metadata?.clientType || null

          const needBillingFromSession =
            data.paymentStatus === 'paid' &&
            clientTypeFromSession === 'business' &&
            data.inquiryId

          if (needBillingFromSession && data.inquiryId) {
            try {
              const inquiryResult = await getInquiryById(data.inquiryId)
              if (inquiryResult.success && inquiryResult.data) {
                setInquiry(inquiryResult.data)
                const invStatus = inquiryResult.data.invoiceStatus
                const retryable = isRetryableInvoiceStatus(invStatus)
                const deliveryMode = inquiryResult.data.invoiceDeliveryMode || null

                // NEW business flow: do not show post-payment billing form.
                // LEGACY rescue: only show when retryable and not in Checkout invoice_creation mode.
                const legacyEligible =
                  retryable && deliveryMode !== 'checkout_invoice_creation'

                setBillingRetryable(legacyEligible)
                setShowBillingForm(false)

                // Prefer persisted inquiry links; fall back to session-derived links.
                setInvoiceLink(
                  inquiryResult.data.hostedInvoiceUrl || (data as any).hostedInvoiceUrl || null
                )
                setInvoicePdf(
                  inquiryResult.data.invoicePdfUrl || (data as any).invoicePdfUrl || null
                )

                // If paid but invoice links not yet available (Checkout invoice creation can lag),
                // show a hint and allow a single auto-refresh.
                const shouldHintRefresh =
                  deliveryMode === 'checkout_invoice_creation' &&
                  data.paymentStatus === 'paid' &&
                  !(inquiryResult.data.hostedInvoiceUrl || (data as any).hostedInvoiceUrl)
                setInvoicePendingRefreshHint(shouldHintRefresh)

                if (shouldHintRefresh) {
                  setTimeout(async () => {
                    try {
                      const retry = await getCheckoutSession(sessionId)
                      if (retry.success && retry.data) {
                        const hosted = (retry.data as any).hostedInvoiceUrl || null
                        const pdf = (retry.data as any).invoicePdfUrl || null
                        if (hosted) setInvoiceLink(hosted)
                        if (pdf) setInvoicePdf(pdf)
                      }
                    } catch (e) {
                      // ignore
                    }
                  }, 1500)
                }
              } else {
                setShowBillingForm(false)
              }
            } catch (inquiryError) {
              console.error('Error fetching inquiry:', inquiryError)
              setShowBillingForm(false)
            }
          }
        } else {
          console.error('Payment verification failed:', result)
          setError(result.message || 'Failed to verify payment')
        }
      } catch (err) {
        console.error('Error verifying payment:', err)
        setError('An error occurred while verifying payment. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  const handleBillingSubmit = (payload?: {
    hostedInvoiceUrl?: string | null
    invoicePdfUrl?: string | null
    inquiryInvoiceStatus?: string
  }) => {
    setBillingSubmitted(true)
    setShowBillingForm(false)
    setBillingRetryable(false)
    if (payload?.hostedInvoiceUrl) setInvoiceLink(payload.hostedInvoiceUrl)
    if (payload?.invoicePdfUrl) setInvoicePdf(payload.invoicePdfUrl)
  }

  return (
    <div className="page-wrapper">
      <div className="success-card">
        {loading ? (
          <>
            <Loader2 size={48} className="animate-spin success-loader" />
            <h1 className="success-title">Verifying Payment...</h1>
            <p className="success-subtitle">Please wait while we confirm your payment.</p>
          </>
        ) : error ? (
          <>
            <div className="success-error-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="success-error-title">Verification Error</h1>
            <p className="success-subtitle success-subtitle-lg">{error}</p>
            <Link href="/" className="btn-primary">Return Home</Link>
          </>
        ) : showBillingForm && sessionData?.inquiryId && sessionId ? (
          <BillingForm
            inquiryId={sessionData.inquiryId}
            sessionId={sessionId}
            onSubmit={handleBillingSubmit}
          />
        ) : paymentStatus === 'paid' ? (
          <>
            <CheckCircle size={48} className="success-check" />
            <h1 className="success-heading">
              {billingSubmitted ? 'Billing Information Submitted!' : 'Payment Successful!'}
            </h1>
            <p className="success-subtitle-lg">
              {billingSubmitted
                ? 'Thank you. Your business invoice is being issued and sent to your email.'
                : 'Thank you for your payment. Your consultation session has been confirmed. We will contact you shortly with the details of your scheduled session.'}
            </p>

            {(invoiceLink || invoicePdf) && (
              <div className="success-actions" style={{ marginTop: '1rem' }}>
                {invoiceLink && (
                  <a className="btn-secondary" href={invoiceLink} target="_blank" rel="noreferrer">
                    Open hosted invoice
                  </a>
                )}
                {invoicePdf && (
                  <a className="btn-secondary" href={invoicePdf} target="_blank" rel="noreferrer">
                    Download invoice PDF
                  </a>
                )}
              </div>
            )}

            {billingRetryable && (
              <div className="success-actions" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBillingForm(true)}
                >
                  Provide billing details (legacy invoice rescue)
                </button>
              </div>
            )}

            {inquiry?.clientType === 'business' &&
              inquiry?.invoiceDeliveryMode === 'checkout_invoice_creation' && (
                <div style={{ marginTop: '1rem', opacity: 0.85 }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    Your invoice is generated by Stripe after successful payment and will be emailed if Stripe
                    “successful payment” customer emails are enabled.
                  </p>
                  {invoicePendingRefreshHint && !(invoiceLink || invoicePdf) && (
                    <p style={{ marginBottom: 0 }}>
                      Invoice links may take a moment to appear. Please refresh this page in a few seconds.
                    </p>
                  )}
                </div>
              )}
            <div className="success-actions">
              <Link href="/" className="btn-primary">Return Home</Link>
              <Link href="/#inquiry" className="btn-secondary">New Inquiry</Link>
            </div>
          </>
        ) : (
          <>
            <div className="success-pending-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="success-title">Payment Pending</h1>
            <p className="success-subtitle success-subtitle-lg">
              Your payment is being processed. Please wait a moment and refresh this page.
            </p>
            <Link href="/" className="btn-primary">Return Home</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function InquirySuccessPage() {
  return (
    <Suspense fallback={
      <div className="page-wrapper">
        <div className="success-card">
          <Loader2 size={48} className="animate-spin success-loader" />
          <h1 className="success-title">Loading...</h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
