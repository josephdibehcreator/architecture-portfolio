'use client'

import { useState } from 'react'
import { CreditCard, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import { getCheckoutSession } from '@/services/stripe'
import { submitBillingInfo } from '@/services/inquiries'
import styles from './BillingPanel.module.css'

interface BillingPanelProps {
  inquiry: Inquiry
  onFinalizeInvoice?: (inquiryId: string, sessionId: string | null, billingData: any) => Promise<void>
  isLoading?: boolean
}

export default function BillingPanel({
  inquiry,
  onFinalizeInvoice,
  isLoading = false
}: BillingPanelProps) {
  const getInvoiceStatusClass = (status: string | undefined) => {
    if (!status) return styles.statusPending
    const statusMap: Record<string, string> = {
      'pending': styles.statusPending,
      'billing_pending': styles.statusBillingPending,
      'finalized': styles.statusFinalized
    }
    return statusMap[status] || styles.statusPending
  }

  const getPaymentStatusClass = (status: string | undefined) => {
    if (!status) return styles.paymentNone
    const statusMap: Record<string, string> = {
      'none': styles.paymentNone,
      'pending': styles.paymentPending,
      'paid': styles.paymentPaid
    }
    return statusMap[status] || styles.paymentNone
  }

  const [billingData, setBillingData] = useState({
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
  const [success, setSuccess] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const canFinalize =
    inquiry.clientType === 'business' &&
    inquiry.paymentStatus === 'paid' &&
    inquiry.invoiceStatus === 'billing_pending'

  const handleRetrieveSession = async () => {
    if (!inquiry.stripeSessionId) {
      setError('No Stripe session ID found')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await getCheckoutSession(inquiry.stripeSessionId)
      if (response.success && response.data) {
        setSessionData(response.data)
        setSuccess('Session retrieved successfully')
      } else {
        setError(response.message || 'Failed to retrieve session')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizeInvoice = async () => {
    if (!billingData.companyName.trim() || !billingData.address.line1.trim() || !billingData.address.city.trim() || !billingData.address.postalCode.trim()) {
      setError('Company name and complete address are required')
      return
    }

    if (billingData.address.country === 'FR' && billingData.siret?.trim()) {
      const digitsOnly = billingData.siret.replace(/\D/g, '')
      if (digitsOnly.length !== 9 && digitsOnly.length !== 14) {
        setError('SIRET/SIREN must be 9 digits (SIREN) or 14 digits (SIRET)')
        return
      }
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const sessionIdOrNull = inquiry.stripeSessionId || null
      if (onFinalizeInvoice) {
        await onFinalizeInvoice(
          inquiry._id,
          sessionIdOrNull,
          billingData
        )
        setSuccess('Invoice finalized successfully')
      } else {
        // Fallback: use the service directly
        const response = await submitBillingInfo(
          inquiry._id,
          sessionIdOrNull,
          billingData
        )
        if (response.success) {
          setSuccess('Invoice finalized successfully')
        } else {
          setError(response.message || 'Failed to finalize invoice')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while finalizing invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.billingPanel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <CreditCard size={20} />
          Stripe Information
        </h3>

        <div className={styles.infoGrid}>
          <div>
            <label className={styles.label}>Customer ID</label>
            <p className={styles.value}>
              {inquiry.stripeCustomerId || (
                <span className={styles.missing}>Not set</span>
              )}
            </p>
          </div>
          <div>
            <label className={styles.label}>Invoice ID</label>
            <p className={styles.value}>
              {inquiry.stripeInvoiceId || (
                <span className={styles.missing}>Not set</span>
              )}
            </p>
          </div>
          <div>
            <label className={styles.label}>Session ID</label>
            <p className={styles.value}>
              {inquiry.stripeSessionId || (
                <span className={styles.missing}>Not set</span>
              )}
            </p>
          </div>
          <div>
            <label className={styles.label}>Invoice Status</label>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${getInvoiceStatusClass(inquiry.invoiceStatus)}`}>
                {inquiry.invoiceStatus || 'Pending'}
              </span>
            </p>
          </div>
          <div>
            <label className={styles.label}>Payment Status</label>
            <p className={styles.value}>
              <span className={`${styles.paymentBadge} ${getPaymentStatusClass(inquiry.paymentStatus)}`}>
                {inquiry.paymentStatus || 'None'}
              </span>
            </p>
          </div>
        </div>

        {inquiry.stripeSessionId && !sessionData && (
          <button
            type="button"
            onClick={handleRetrieveSession}
            className={styles.retrieveButton}
            disabled={loading || isLoading}
          >
            <RefreshCw size={16} />
            Retrieve Customer from Session
          </button>
        )}

        {sessionData && (
          <div className={styles.sessionData}>
            <h4>Session Data</h4>
            <pre className={styles.jsonData}>
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {inquiry.clientType === 'business' && inquiry.invoiceStatus === 'billing_pending' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Finalize Invoice</h3>
          <p className={styles.description}>
            Complete billing information is required to finalize the invoice for business clients.
          </p>

          {!canFinalize && (
            <p className={styles.description}>
              Billing can only be submitted when payment is completed and the invoice is awaiting billing information.
            </p>
          )}

          {error && (
            <div className={styles.alertError}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Company Name *</label>
              <input
                id="companyName"
                type="text"
                value={billingData.companyName}
                onChange={(e) => setBillingData(prev => ({ ...prev, companyName: e.target.value }))}
                className={styles.input}
                disabled={loading || isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="addressLine1">Address Line 1 *</label>
              <input
                id="addressLine1"
                type="text"
                value={billingData.address.line1}
                onChange={(e) => setBillingData(prev => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value }
                }))}
                className={styles.input}
                disabled={loading || isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                id="addressLine2"
                type="text"
                value={billingData.address.line2}
                onChange={(e) => setBillingData(prev => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value }
                }))}
                className={styles.input}
                disabled={loading || isLoading}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  type="text"
                  value={billingData.address.city}
                  onChange={(e) => setBillingData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  className={styles.input}
                  disabled={loading || isLoading}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="postalCode">Postal Code *</label>
                <input
                  id="postalCode"
                  type="text"
                  value={billingData.address.postalCode}
                  onChange={(e) => setBillingData(prev => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value }
                  }))}
                  className={styles.input}
                  disabled={loading || isLoading}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                value={billingData.address.country}
                onChange={(e) => setBillingData(prev => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                className={styles.input}
                disabled={loading || isLoading}
                placeholder="FR"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vatNumber">VAT Number</label>
              <input
                id="vatNumber"
                type="text"
                value={billingData.vatNumber}
                onChange={(e) => setBillingData(prev => ({ ...prev, vatNumber: e.target.value }))}
                className={styles.input}
                disabled={loading || isLoading}
                placeholder="FR12345678901"
              />
            </div>

            {billingData.address.country === 'FR' && (
              <div className={styles.formGroup}>
                <label htmlFor="siret">SIRET / SIREN (optional, French companies)</label>
                <input
                  id="siret"
                  type="text"
                  inputMode="numeric"
                  value={billingData.siret}
                  onChange={(e) => setBillingData(prev => ({ ...prev, siret: e.target.value }))}
                  className={styles.input}
                  disabled={loading || isLoading}
                  placeholder="123 456 789 01234"
                />
                <p className={styles.fieldHint}>SIREN 9 digits or SIRET 14 digits</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleFinalizeInvoice}
              className={styles.finalizeButton}
              disabled={loading || isLoading || !canFinalize}
            >
              {loading ? 'Finalizing...' : 'Finalize Invoice'}
            </button>
          </div>
        </div>
      )}

      {inquiry.invoiceStatus === 'finalized' && (
        <div className={styles.alertSuccess}>
          <CheckCircle size={16} />
          Invoice has been finalized
        </div>
      )}
    </div>
  )
}
