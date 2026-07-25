'use client'

import { CheckSquare, Square } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import InquiryActions from './InquiryActions'
import styles from './InquiryRow.module.css'

interface InquiryRowProps {
  inquiry: Inquiry
  isSelected: boolean
  onSelect: (id: string) => void
  onView: (inquiry: Inquiry) => void
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  actionLoading: string | null
}

export default function InquiryRow({
  inquiry,
  isSelected,
  onSelect,
  onView,
  onStatusChange,
  onDelete,
  actionLoading
}: InquiryRowProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeClass = (status: string | undefined) => {
    if (!status) return styles.statusDraft
    switch (status) {
      case 'submitted':
        return styles.statusSubmitted
      case 'reviewed':
        return styles.statusReviewed
      case 'paid':
      case 'invoice_finalized':
      case 'completed':
        return styles.statusCompleted
      case 'cancelled':
        return styles.statusCancelled
      default:
        return styles.statusDraft
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return 'Draft'
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getPaymentStatusBadgeClass = (paymentStatus: string | undefined) => {
    if (!paymentStatus) return styles.paymentNone
    switch (paymentStatus) {
      case 'paid':
        return styles.paymentPaid
      case 'pending':
        return styles.paymentPending
      default:
        return styles.paymentNone
    }
  }

  const fullName = `${inquiry.firstName || ''} ${inquiry.lastName || ''}`.trim() || 'N/A'
  const services = Array.isArray(inquiry.selectedServices) && inquiry.selectedServices.length > 0
    ? inquiry.selectedServices.join(', ')
    : 'None'

  return (
    <tr className={styles.row}>
      <td className={styles.checkboxCol}>
        <button
          type="button"
          onClick={() => onSelect(inquiry._id)}
          className={styles.checkboxButton}
          aria-label={`Select ${fullName}`}
        >
          {isSelected ? (
            <CheckSquare size={18} />
          ) : (
            <Square size={18} />
          )}
        </button>
      </td>
      <td>
        <div className={styles.dateCell}>
          {formatDate(inquiry.createdAt)}
        </div>
      </td>
      <td>
        <div className={styles.clientCell}>
          <strong>{fullName}</strong>
          <span className={styles.clientType}>
            {inquiry.clientType === 'business' ? 'Business' : 'Private'}
          </span>
        </div>
      </td>
      <td>
        <div className={styles.contactCell}>
          <div>{inquiry.email || 'N/A'}</div>
          {inquiry.phone && (
            <div className={styles.phone}>{inquiry.phone}</div>
          )}
        </div>
      </td>
      <td>
        <div className={styles.servicesCell}>
          {services}
        </div>
      </td>
      <td>
        <div className={styles.projectCell}>
          {inquiry.budget && <div>Budget: {inquiry.budget}</div>}
          {inquiry.timeline && <div>Timeline: {inquiry.timeline}</div>}
          {inquiry.surface && <div>Surface: {inquiry.surface}</div>}
        </div>
      </td>
      <td>
        <span className={`${styles.statusBadge} ${getStatusBadgeClass(inquiry.status)}`}>
          {getStatusLabel(inquiry.status)}
        </span>
      </td>
      <td>
        <span className={`${styles.paymentBadge} ${getPaymentStatusBadgeClass(inquiry.paymentStatus)}`}>
          {inquiry.paymentStatus || 'None'}
        </span>
        {inquiry.invoiceStatus && (
          <div className={styles.invoiceStatus}>
            Invoice: {inquiry.invoiceStatus}
          </div>
        )}
      </td>
      <td className={styles.actionsCol}>
        <InquiryActions
          inquiry={inquiry}
          onView={onView}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          loading={actionLoading === inquiry._id}
        />
      </td>
    </tr>
  )
}
