'use client'

import { Eye, Edit, Trash2, CreditCard } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import styles from './InquiryActions.module.css'

interface InquiryActionsProps {
  inquiry: Inquiry
  onView: (inquiry: Inquiry) => void
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  loading: boolean
}

export default function InquiryActions({
  inquiry,
  onView,
  onStatusChange,
  onDelete,
  loading
}: InquiryActionsProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    if (newStatus && newStatus !== inquiry.status) {
      onStatusChange(inquiry._id, newStatus)
    }
  }

  return (
    <div className={styles.actions}>
      <button
        type="button"
        onClick={() => onView(inquiry)}
        className={styles.actionButton}
        title="View Details"
        disabled={loading}
      >
        <Eye size={16} />
      </button>

      <select
        value={inquiry.status || 'draft'}
        onChange={handleStatusChange}
        className={styles.statusSelect}
        disabled={loading}
        title="Change Status"
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

      {(inquiry.stripeSessionId || inquiry.stripeCustomerId) && (
        <button
          type="button"
          onClick={() => onView(inquiry)}
          className={styles.actionButton}
          title="Billing / Stripe"
          disabled={loading}
        >
          <CreditCard size={16} />
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(inquiry._id)}
        className={`${styles.actionButton} ${styles.deleteButton}`}
        title="Delete"
        disabled={loading}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
