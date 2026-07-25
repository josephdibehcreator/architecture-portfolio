'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, XCircle, MessageCircle, Mail } from 'lucide-react'
import { type Testimonial } from '@/services/testimonials'
import styles from './TestimonialModal.module.css'

interface TestimonialModalProps {
  testimonial: Testimonial
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  onWhatsApp: () => void
  onEmail: () => void
  isLoading?: boolean
}

export default function TestimonialModal({
  testimonial,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onWhatsApp,
  onEmail,
  isLoading = false
}: TestimonialModalProps) {
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

  if (!isOpen) return null

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

  const getStatusBadgeClass = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved
      case 'rejected':
        return styles.statusRejected
      default:
        return styles.statusPending
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Testimonial Details</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>Status</label>
            <span className={`${styles.statusBadge} ${getStatusBadgeClass(testimonial.status)}`}>
              {getStatusLabel(testimonial.status)}
            </span>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Full Name</label>
            <p className={styles.value}>{testimonial.fullName}</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Email</label>
            <p className={styles.value}>{testimonial.email}</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Phone Number</label>
            <p className={styles.value}>{testimonial.phoneNumber || 'N/A'}</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Project Type</label>
            <p className={styles.value}>{testimonial.projectType || 'N/A'}</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Review</label>
            <div className={styles.reviewBox}>
              <p className={styles.reviewText}>{testimonial.review}</p>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Created At</label>
            <p className={styles.value}>{formatDate(testimonial.createdAt)}</p>
          </div>

          {testimonial.approvedAt && (
            <div className={styles.section}>
              <label className={styles.label}>Approved At</label>
              <p className={styles.value}>{formatDate(testimonial.approvedAt)}</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.contactActions}>
            {testimonial.phoneNumber && (
              <button
                className={`${styles.contactBtn} ${styles.whatsappBtn}`}
                onClick={onWhatsApp}
                title="WhatsApp"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </button>
            )}
            <button
              className={`${styles.contactBtn} ${styles.emailBtn}`}
              onClick={onEmail}
              title="Email"
            >
              <Mail size={18} />
              <span>Email</span>
            </button>
          </div>

          <div className={styles.actionButtons}>
            {testimonial.status !== 'approved' && (
              <button
                className={`${styles.actionButton} ${styles.approveButton}`}
                onClick={onApprove}
                disabled={isLoading}
              >
                <Check size={18} />
                <span>Approve</span>
              </button>
            )}
            {testimonial.status !== 'rejected' && (
              <button
                className={`${styles.actionButton} ${styles.rejectButton}`}
                onClick={onReject}
                disabled={isLoading}
              >
                <XCircle size={18} />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return typeof window !== 'undefined' && document.body
    ? createPortal(modalContent, document.body)
    : null
}
