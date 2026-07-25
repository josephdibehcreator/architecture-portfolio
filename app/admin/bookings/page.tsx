'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Eye } from 'lucide-react'
import { listInquiries, type Inquiry, type ListInquiriesResponse } from '@/services/admin/inquiries'
import styles from './bookings.module.css'

type PaymentFilter = 'all' | 'paid' | 'pending'
type InvoiceFilter = 'all' | 'pending' | 'billing_pending' | 'finalized'
type ClientTypeFilter = 'all' | 'private' | 'business'
type PathFilter = 'all' | 'general' | 'consult'



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

function getBookingBadge(inquiry: Inquiry) {
  const payment = inquiry.paymentStatus
  const invoice = inquiry.invoiceStatus
  const clientType = inquiry.clientType

  if (payment === 'paid' && clientType === 'private' && invoice === 'finalized') {
    return { className: `${styles.badge} ${styles.badgeGreen}`, label: 'Paid · Invoice Finalized' }
  }

  if (payment === 'paid' && clientType === 'business' && invoice === 'billing_pending') {
    return { className: `${styles.badge} ${styles.badgeOrange}`, label: 'Paid · Awaiting Billing Info' }
  }

  if (payment === 'pending') {
    return { className: `${styles.badge} ${styles.badgeRed}`, label: 'Payment Pending' }
  }

  // Fallback (covers older records / mixed states)
  return { className: `${styles.badge} ${styles.badgeOrange}`, label: `${payment || 'unknown'} · ${invoice || 'unknown'}` }
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [kpis, setKpis] = useState({ total: 0, paid: 0, pending: 0, billingPending: 0 })

  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all')
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>('all')
  const [clientTypeFilter, setClientTypeFilter] = useState<ClientTypeFilter>('all')
  const [pathFilter, setPathFilter] = useState<PathFilter>('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: 'createdAt',
        order: 'desc'
      }

      if (search.trim()) {
        params.q = search.trim()
      }
      if (paymentFilter !== 'all') {
        params.paymentStatus = paymentFilter
      }
      if (invoiceFilter !== 'all') {
        params.invoiceStatus = invoiceFilter
      }
      if (clientTypeFilter !== 'all') {
        params.clientType = clientTypeFilter
      }
      if (pathFilter !== 'all') {
        params.selectedPath = pathFilter
      }

      const response = await listInquiries(params)

      if (response.success && response.data) {
        const data = response.data as ListInquiriesResponse
        setInquiries(Array.isArray(data.data) ? data.data : [])

        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            page: data.pagination.page || prev.page || 1,
            limit: data.pagination.limit || prev.limit || 25,
            total: data.pagination.total || 0,
            totalPages: data.pagination.totalPages || 0
          }))
        }

        // Calculate KPIs from current page data (for display)
        // Note: For accurate KPIs, you'd need separate aggregation endpoints
        const paid = data.data.filter((i) => i.paymentStatus === 'paid').length
        const pending = data.data.filter((i) => (i.paymentStatus || 'pending') === 'pending').length
        const billingPending = data.data.filter((i) => i.invoiceStatus === 'billing_pending').length
        setKpis({
          total: data.pagination.total || 0,
          paid,
          pending,
          billingPending
        })
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load bookings')
        setInquiries([])
      }
    } catch (e: any) {
      if (e?.message?.includes('401') || e?.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading bookings')
      console.error('Bookings error:', e)
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [search, paymentFilter, invoiceFilter, clientTypeFilter, pathFilter])

  // Fetch bookings when pagination or filters change
  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchBookings()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, search, paymentFilter, invoiceFilter, clientTypeFilter, pathFilter])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.subtitle}>
            Read-only booking dashboard powered by inquiries. Track paid status, invoice finalization, and business billing pending.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.kpis}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total bookings</div>
          <div className={styles.kpiValue}>{kpis.total}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Paid bookings</div>
          <div className={styles.kpiValue}>{kpis.paid}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Pending payments</div>
          <div className={styles.kpiValue}>{kpis.pending}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Business billing pending</div>
          <div className={styles.kpiValue}>{kpis.billingPending}</div>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className={styles.select} value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}>
          <option value="all">All payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        <select className={styles.select} value={invoiceFilter} onChange={(e) => setInvoiceFilter(e.target.value as InvoiceFilter)}>
          <option value="all">All invoices</option>
          <option value="pending">Pending</option>
          <option value="billing_pending">Billing pending</option>
          <option value="finalized">Finalized</option>
        </select>

        <select className={styles.select} value={clientTypeFilter} onChange={(e) => setClientTypeFilter(e.target.value as ClientTypeFilter)}>
          <option value="all">All client types</option>
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>

        <select className={styles.select} value={pathFilter} onChange={(e) => setPathFilter(e.target.value as PathFilter)}>
          <option value="all">All paths</option>
          <option value="consult">Consultation</option>
          <option value="general">General</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Type</th>
              <th>Path</th>
              <th>Duration</th>
              <th>Roadmap</th>
              <th>Status</th>
              <th>Invoice</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} style={{ padding: 16, color: '#6c757d' }}>
                  Loading…
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: 16, color: '#6c757d' }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              inquiries.map((i) => {
                const fullName = `${i.firstName || ''} ${i.lastName || ''}`.trim() || 'N/A'
                const badge = getBookingBadge(i)
                const duration = i.consultationDetails?.duration || '—'
                const roadmap = i.consultationDetails?.roadmapReport ? 'Yes' : 'No'
                const path = i.selectedPath || '—'

                return (
                  <tr key={i._id} className={styles.row}>
                    <td>{fullName}</td>
                    <td>{i.email || 'N/A'}</td>
                    <td>{i.clientType}</td>
                    <td>{path}</td>
                    <td>{duration}</td>
                    <td>{roadmap}</td>
                    <td>
                      <span className={badge.className}>{badge.label}</span>
                    </td>
                    <td>{i.invoiceStatus || 'pending'}</td>
                    <td>{formatDate(i.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/bookings/${i._id}`}
                          className={`${styles.actionButton} ${styles.linkButton}`}
                          title="View booking"
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        {i.stripeCustomerId && (
                          <a
                            className={`${styles.actionButton} ${styles.linkButton}`}
                            href={getStripeCustomerUrl(i.stripeCustomerId)}
                            target="_blank"
                            rel="noreferrer"
                            title="Open Stripe customer"
                          >
                            <ExternalLink size={14} />
                            Stripe
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationControls}>
            <label className={styles.pageSizeLabel}>
              Per page:
              <select
                value={pagination.limit}
                onChange={(e) => {
                  setPagination(prev => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }))
                }}
                className={styles.pageSizeSelect}
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
          <div className={styles.paginationNav}>
            <button
              type="button"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <button
              type="button"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

