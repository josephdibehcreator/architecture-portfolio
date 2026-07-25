'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Phone, MapPin, Calendar, Clock, CreditCard, FileText, Download, ExternalLink } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import DocumentsViewer from './DocumentsViewer'
import BillingPanel from './BillingPanel'
import NotesEditor from './NotesEditor'
import styles from './InquiryDetailsModal.module.css'

interface InquiryDetailsModalProps {
  inquiry: Inquiry | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: string, adminNote?: string) => Promise<void>
  onCreateCheckoutSession?: (inquiryId: string) => Promise<void>
  onFinalizeInvoice?: (inquiryId: string, sessionId: string | null, billingData: any) => Promise<void>
  isLoading?: boolean
}

export default function InquiryDetailsModal({
  inquiry,
  isOpen,
  onClose,
  onStatusChange,
  onCreateCheckoutSession,
  onFinalizeInvoice,
  isLoading = false
}: InquiryDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'billing' | 'documents' | 'notes'>('details')
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !inquiry || !mounted) return null

  const getStatusBadgeClass = (status: string | undefined) => {
    if (!status) return styles.statusDraft
    const statusMap: Record<string, string> = {
      'draft': styles.statusDraft,
      'submitted': styles.statusSubmitted,
      'reviewed': styles.statusReviewed,
      'consultation_pending_payment': styles.statusSubmitted,
      'payment_pending': styles.statusSubmitted,
      'paid': styles.statusCompleted,
      'invoice_finalized': styles.statusCompleted,
      'completed': styles.statusCompleted,
      'cancelled': styles.statusCancelled
    }
    return statusMap[status] || styles.statusDraft
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return formatDate(dateString)
  }

  const fullName = `${inquiry.firstName || ''} ${inquiry.lastName || ''}`.trim() || 'N/A'

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Inquiry Details</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'billing' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing / Stripe
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents ({inquiry.documentUrls?.length || 0})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'notes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes ({inquiry.adminNotes?.length || 0})
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'details' && (
            <div className={styles.detailsTab}>
              {/* Status Badge */}
              <div className={styles.section}>
                <label className={styles.label}>Status</label>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(inquiry.status)}`}>
                  {inquiry.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Draft'}
                </span>
              </div>

              {/* Identity */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Identity</h3>
                <div className={styles.grid}>
                  <div>
                    <label className={styles.label}>Full Name</label>
                    <p className={styles.value}>{fullName}</p>
                  </div>
                  <div>
                    <label className={styles.label}>Client Type</label>
                    <p className={styles.value}>
                      <span className={styles.badge}>{inquiry.clientType === 'business' ? 'Business' : 'Private'}</span>
                    </p>
                  </div>
                  <div>
                    <label className={styles.label}>Email</label>
                    <p className={styles.value}>
                      <a href={`mailto:${inquiry.email}`} className={styles.link}>
                        <Mail size={16} />
                        {inquiry.email}
                      </a>
                    </p>
                  </div>
                  {inquiry.phone && (
                    <div>
                      <label className={styles.label}>Phone</label>
                      <p className={styles.value}>
                        <a href={`tel:${inquiry.phone}`} className={styles.link}>
                          <Phone size={16} />
                          {inquiry.phone}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Context */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Project Context</h3>
                {inquiry.address && (
                  <div>
                    <label className={styles.label}>
                      <MapPin size={16} />
                      Address
                    </label>
                    <p className={styles.value}>{inquiry.address}</p>
                  </div>
                )}
                {inquiry.selectedServices && inquiry.selectedServices.length > 0 && (
                  <div>
                    <label className={styles.label}>Selected Services</label>
                    <div className={styles.servicesList}>
                      {inquiry.selectedServices.map((service, idx) => (
                        <span key={idx} className={styles.serviceTag}>{service}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.grid}>
                  {inquiry.budget && (
                    <div>
                      <label className={styles.label}>Budget</label>
                      <p className={styles.value}>{inquiry.budget}</p>
                    </div>
                  )}
                  {inquiry.timeline && (
                    <div>
                      <label className={styles.label}>Timeline</label>
                      <p className={styles.value}>{inquiry.timeline}</p>
                    </div>
                  )}
                  {inquiry.surface && (
                    <div>
                      <label className={styles.label}>Surface</label>
                      <p className={styles.value}>{inquiry.surface}</p>
                    </div>
                  )}
                </div>
                {inquiry.description && (
                  <div>
                    <label className={styles.label}>Description</label>
                    <p className={styles.value}>{inquiry.description}</p>
                  </div>
                )}
              </div>

              {/* Consultation Details */}
              {inquiry.selectedPath === 'consult' && inquiry.consultationDetails && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Consultation Details</h3>
                  <div className={styles.grid}>
                    <div>
                      <label className={styles.label}>
                        <Clock size={16} />
                        Duration
                      </label>
                      <p className={styles.value}>{inquiry.consultationDetails.duration} minutes</p>
                    </div>
                    <div>
                      <label className={styles.label}>Format</label>
                      <p className={styles.value}>
                        {inquiry.consultationDetails.format === 'onsite' 
                          ? 'On-site (Paris area)' 
                          : 'Online (Google Meet)'}
                      </p>
                    </div>
                    <div>
                      <label className={styles.label}>Roadmap Report</label>
                      <p className={styles.value}>
                        {inquiry.consultationDetails.roadmapReport ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  {inquiry.consultationDetails.selectedDate && (
                    <div>
                      <label className={styles.label}>
                        <Calendar size={16} />
                        Selected Date
                      </label>
                      <p className={styles.value}>
                        {formatDate(inquiry.consultationDetails.selectedDate)}
                        {inquiry.consultationDetails.selectedTime && ` at ${inquiry.consultationDetails.selectedTime}`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* History / Timeline */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>History</h3>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <label className={styles.label}>Created</label>
                    <p className={styles.value}>
                      {formatDate(inquiry.createdAt)}
                      <span className={styles.relativeTime}>({formatRelativeTime(inquiry.createdAt)})</span>
                    </p>
                  </div>
                  {inquiry.submittedAt && (
                    <div className={styles.timelineItem}>
                      <label className={styles.label}>Submitted</label>
                      <p className={styles.value}>
                        {formatDate(inquiry.submittedAt)}
                        <span className={styles.relativeTime}>({formatRelativeTime(inquiry.submittedAt)})</span>
                      </p>
                    </div>
                  )}
                  {inquiry.paidAt && (
                    <div className={styles.timelineItem}>
                      <label className={styles.label}>Paid</label>
                      <p className={styles.value}>
                        {formatDate(inquiry.paidAt)}
                        <span className={styles.relativeTime}>({formatRelativeTime(inquiry.paidAt)})</span>
                      </p>
                    </div>
                  )}
                  {inquiry.billingCollectedAt && (
                    <div className={styles.timelineItem}>
                      <label className={styles.label}>Billing Collected</label>
                      <p className={styles.value}>
                        {formatDate(inquiry.billingCollectedAt)}
                        <span className={styles.relativeTime}>({formatRelativeTime(inquiry.billingCollectedAt)})</span>
                      </p>
                    </div>
                  )}
                  {inquiry.reviewedAt && (
                    <div className={styles.timelineItem}>
                      <label className={styles.label}>Reviewed</label>
                      <p className={styles.value}>
                        {formatDate(inquiry.reviewedAt)}
                        {inquiry.reviewedBy && (
                          <span className={styles.reviewedBy}> by {inquiry.reviewedBy.email}</span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className={styles.timelineItem}>
                    <label className={styles.label}>Last Updated</label>
                    <p className={styles.value}>
                      {formatDate(inquiry.updatedAt)}
                      <span className={styles.relativeTime}>({formatRelativeTime(inquiry.updatedAt)})</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Quick Actions</h3>
                <div className={styles.actions}>
                  <select
                    value={inquiry.status || 'draft'}
                    onChange={(e) => {
                      const newStatus = e.target.value
                      if (newStatus !== inquiry.status) {
                        onStatusChange(inquiry._id, newStatus)
                      }
                    }}
                    className={styles.statusSelect}
                    disabled={isLoading}
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="consultation_pending_payment">Consultation Pending Payment</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="paid">Paid</option>
                    <option value="invoice_finalized">Invoice Finalized</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {onCreateCheckoutSession && inquiry.selectedPath === 'consult' && (
                    <button
                      type="button"
                      onClick={() => onCreateCheckoutSession(inquiry._id)}
                      className={styles.actionButton}
                      disabled={isLoading}
                    >
                      <CreditCard size={16} />
                      {inquiry.stripeSessionId ? 'Retry Checkout Session' : 'Create Checkout Session'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <BillingPanel
              inquiry={inquiry}
              onFinalizeInvoice={onFinalizeInvoice}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsViewer
              documents={inquiry.documentUrls || []}
            />
          )}

          {activeTab === 'notes' && (
            <NotesEditor
              inquiry={inquiry}
              onStatusChange={onStatusChange}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
