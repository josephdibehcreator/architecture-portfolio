'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getInquiry, type Inquiry } from '@/services/admin/inquiries'
import styles from './booking-details.module.css'

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStripeCustomerUrl(customerId: string) {
  return `https://dashboard.stripe.com/customers/${customerId}`
}

function getStripeInvoiceUrl(invoiceId: string) {
  return `https://dashboard.stripe.com/invoices/${invoiceId}`
}



export default function AdminBookingDetailsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await getInquiry(id)
        if (res.success && res.data) {
          setInquiry(res.data)
        } else {
          if (res.error && (res.error.includes('401') || res.error.includes('Authentication'))) {
            router.push('/admin/login')
            return
          }
          setError(res.message || 'Failed to load booking')
        }
      } catch (e: any) {
        if (e?.message?.includes('401') || e?.response?.status === 401) {
          router.push('/admin/login')
          return
        }
        setError('An error occurred while loading booking')
        // eslint-disable-next-line no-console
        console.error('Booking details error:', e)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [id, router])

  const fullName = useMemo(() => {
    if (!inquiry) return 'Booking'
    return `${inquiry.firstName || ''} ${inquiry.lastName || ''}`.trim() || 'Booking'
  }, [inquiry])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{fullName}</h1>
          <p className={styles.subtitle}>
            Read-only booking details (inquiry). Includes consultation details, Stripe IDs, billing state, and timestamps.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/bookings" className={styles.actionButton}>
            <ArrowLeft size={14} />
            Back
          </Link>

          {inquiry?.stripeCustomerId && (
            <a
              className={styles.actionButton}
              href={getStripeCustomerUrl(inquiry.stripeCustomerId)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              Stripe Customer
            </a>
          )}

          {inquiry?.stripeInvoiceId && (
            <a
              className={styles.actionButton}
              href={getStripeInvoiceUrl(inquiry.stripeInvoiceId)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              Stripe Invoice
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className={styles.card}>Loading…</div>
      ) : !inquiry ? (
        <div className={styles.card}>No booking found.</div>
      ) : (
        <>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Booking summary</div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Inquiry ID</div>
                <div className={styles.value}>{inquiry._id}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Client type</div>
                <div className={styles.value}>{inquiry.clientType}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Selected path</div>
                <div className={styles.value}>{inquiry.selectedPath || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Payment status</div>
                <div className={styles.value}>{inquiry.paymentStatus || 'pending'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Invoice status</div>
                <div className={styles.value}>{inquiry.invoiceStatus || 'pending'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Status (workflow)</div>
                <div className={styles.value}>{inquiry.status || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionTitle}>Contact</div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Email</div>
                <div className={styles.value}>{inquiry.email || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Phone</div>
                <div className={styles.value}>{inquiry.phone || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Address</div>
                <div className={styles.value}>{inquiry.address || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionTitle}>Consultation details</div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Duration</div>
                <div className={styles.value}>{inquiry.consultationDetails?.duration || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Roadmap report</div>
                <div className={styles.value}>{inquiry.consultationDetails?.roadmapReport ? 'Yes' : 'No'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Format</div>
                <div className={styles.value}>
                  {inquiry.consultationDetails?.format === 'onsite' 
                    ? 'On-site (Paris area)' 
                    : inquiry.consultationDetails?.format === 'online'
                    ? 'Online (Google Meet)'
                    : 'N/A'}
                </div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Selected date</div>
                <div className={styles.value}>{inquiry.consultationDetails?.selectedDate || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Selected time</div>
                <div className={styles.value}>{inquiry.consultationDetails?.selectedTime || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionTitle}>Stripe</div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Stripe session ID</div>
                <div className={styles.value}>{inquiry.stripeSessionId || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Stripe customer ID</div>
                <div className={styles.value}>{inquiry.stripeCustomerId || 'N/A'}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Stripe invoice ID</div>
                <div className={styles.value}>{inquiry.stripeInvoiceId || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionTitle}>Timestamps</div>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Created at</div>
                <div className={styles.value}>{formatDate(inquiry.createdAt)}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Updated at</div>
                <div className={styles.value}>{formatDate(inquiry.updatedAt)}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Submitted at</div>
                <div className={styles.value}>{formatDate(inquiry.submittedAt)}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Paid at</div>
                <div className={styles.value}>{formatDate(inquiry.paidAt)}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Billing collected at</div>
                <div className={styles.value}>{formatDate(inquiry.billingCollectedAt)}</div>
              </div>
              <div className={styles.field}>
                <div className={styles.label}>Reviewed at</div>
                <div className={styles.value}>{formatDate(inquiry.reviewedAt)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

