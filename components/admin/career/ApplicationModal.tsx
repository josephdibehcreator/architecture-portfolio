'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, XCircle, Mail, MessageCircle, Download, FileText, ExternalLink } from 'lucide-react'
import { type CareerApplication } from '@/services/admin/careersApplication'
import styles from './ApplicationModal.module.css'

interface ApplicationModalProps {
  application: CareerApplication
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (id: string, status: CareerApplication['status'], adminNote?: string) => void
  onEmail: (email: string, jobTitle: string) => void
  onWhatsApp: (phone: string | undefined) => void
  onDownload: (id: string, type: 'cv' | 'portfolio') => void
  isLoading?: boolean
}

export default function ApplicationModal({
  application,
  isOpen,
  onClose,
  onStatusUpdate,
  onEmail,
  onWhatsApp,
  onDownload,
  isLoading = false
}: ApplicationModalProps) {
  const [adminNote, setAdminNote] = useState(application.adminNote || '')
  const [showConfirm, setShowConfirm] = useState<{ action: 'accepted' | 'rejected' | null }>({ action: null })

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showConfirm.action) {
          setShowConfirm({ action: null })
        } else {
          onClose()
        }
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
  }, [isOpen, onClose, showConfirm])

  // Update admin note when application changes
  useEffect(() => {
    setAdminNote(application.adminNote || '')
  }, [application])

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return styles.statusAccepted
      case 'rejected':
        return styles.statusRejected
      case 'reviewed':
        return styles.statusReviewed
      default:
        return styles.statusPending
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      case 'reviewed':
        return 'Reviewed'
      default:
        return 'Pending'
    }
  }

  const isPdf = (url: string | null | undefined) => {
    if (!url) return false
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf')
  }

  const handleStatusAction = (status: 'accepted' | 'rejected') => {
    setShowConfirm({ action: status })
  }

  const confirmStatusAction = () => {
    if (showConfirm.action) {
      onStatusUpdate(application._id, showConfirm.action, adminNote.trim() || undefined)
      setShowConfirm({ action: null })
    }
  }

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Application Details</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Status Badge */}
          <div className={styles.section}>
            <label className={styles.label}>Status</label>
            <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
          </div>

          {/* Applicant Information */}
          <div className={styles.section}>
            <label className={styles.label}>Full Name</label>
            <p className={styles.value}>{application.fullName}</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Email</label>
            <p className={styles.value}>
              <a
                href={`mailto:${application.email}`}
                onClick={(e) => {
                  e.preventDefault()
                  onEmail(application.email, application.jobTitle)
                }}
                className={styles.link}
              >
                {application.email}
              </a>
            </p>
          </div>

          {application.phone && (
            <div className={styles.section}>
              <label className={styles.label}>Phone</label>
              <p className={styles.value}>
                {application.phone}
                {application.phone && (
                  <button
                    className={styles.whatsappLink}
                    onClick={() => onWhatsApp(application.phone)}
                    title="Open WhatsApp"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                )}
              </p>
            </div>
          )}

          <div className={styles.section}>
            <label className={styles.label}>Job Title</label>
            <p className={styles.value}>{application.jobTitle}</p>
          </div>

          {/* Motivation Letter */}
          <div className={styles.section}>
            <label className={styles.label}>Motivation Letter</label>
            <div className={styles.motivationLetter}>
              {application.motivationLetter}
            </div>
          </div>

          {/* Email Delivery Status */}
          <div className={styles.section}>
            <label className={styles.label}>Email Delivery</label>
            <div className={styles.emailStatusGrid}>
              <div className={styles.emailStatusItem}>
                <span className={styles.emailStatusLabel}>Applicant auto-reply:</span>
                <span className={styles.emailStatusValue}>
                  {application.applicantEmailSent ? 'Sent' : 'Not sent'}
                  {application.applicantEmailSentAt && (
                    <span className={styles.emailStatusTimestamp}>
                      {' '}({formatDate(application.applicantEmailSentAt)})
                    </span>
                  )}
                </span>
              </div>
              <div className={styles.emailStatusItem}>
                <span className={styles.emailStatusLabel}>HR notification:</span>
                <span className={styles.emailStatusValue}>
                  {application.hrNotificationSent ? 'Sent' : 'Not sent'}
                  {application.hrNotificationSentAt && (
                    <span className={styles.emailStatusTimestamp}>
                      {' '}({formatDate(application.hrNotificationSentAt)})
                    </span>
                  )}
                </span>
              </div>
            </div>
            {Array.isArray(application.emailErrors) && application.emailErrors.length > 0 && (
              <div className={styles.emailErrors}>
                <p className={styles.emailErrorsTitle}>Email errors / notes:</p>
                <ul className={styles.emailErrorsList}>
                  {application.emailErrors.map((err, idx) => (
                    <li key={idx} className={styles.emailErrorItem}>
                      <span className={styles.emailErrorType}>
                        {err.type ? `${err.type}: ` : ''}
                      </span>
                      <span>{err.message}</span>
                      {err.skippedCode && (
                        <span className={styles.emailErrorCode}>
                          {' '}({err.skippedCode})
                        </span>
                      )}
                      {err.at && (
                        <span className={styles.emailErrorTimestamp}>
                          {' '}– {formatDate(err.at)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CV */}
          <div className={styles.section}>
            <label className={styles.label}>CV</label>
            {application.cvUrl ? (
              <div className={styles.fileContainer}>
                {isPdf(application.cvUrl) ? (
                  <iframe
                    src={application.cvUrl}
                    className={styles.pdfPreview}
                    title="CV Preview"
                  />
                ) : (
                  <div className={styles.filePreview}>
                    <FileText size={48} />
                    <p>Preview not available</p>
                  </div>
                )}
                <div className={styles.fileActions}>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => onDownload(application._id, 'cv')}
                  >
                    <Download size={16} />
                    Download CV
                  </button>
                  <a
                    href={application.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                  >
                    <ExternalLink size={16} />
                    Open in New Tab
                  </a>
                </div>
              </div>
            ) : (
              <p className={styles.noFile}>No CV uploaded</p>
            )}
          </div>

          {/* Portfolio */}
          {application.portfolioUrl && (
            <div className={styles.section}>
              <label className={styles.label}>Portfolio</label>
              <div className={styles.fileContainer}>
                {isPdf(application.portfolioUrl) ? (
                  <iframe
                    src={application.portfolioUrl}
                    className={styles.pdfPreview}
                    title="Portfolio Preview"
                  />
                ) : (
                  <div className={styles.filePreview}>
                    <FileText size={48} />
                    <p>Preview not available</p>
                  </div>
                )}
                <div className={styles.fileActions}>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => onDownload(application._id, 'portfolio')}
                  >
                    <Download size={16} />
                    Download Portfolio
                  </button>
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                  >
                    <ExternalLink size={16} />
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Admin Note */}
          <div className={styles.section}>
            <label className={styles.label}>Admin Note</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note about this application..."
              className={styles.adminNote}
              rows={3}
            />
          </div>

          {/* Timestamps */}
          <div className={styles.section}>
            <label className={styles.label}>Applied At</label>
            <p className={styles.value}>{formatDate(application.createdAt)}</p>
          </div>

          {application.updatedAt && (
            <div className={styles.section}>
              <label className={styles.label}>Last Updated</label>
              <p className={styles.value}>{formatDate(application.updatedAt)}</p>
            </div>
          )}

          {application.reviewedAt && (
            <div className={styles.section}>
              <label className={styles.label}>Reviewed At</label>
              <p className={styles.value}>{formatDate(application.reviewedAt)}</p>
              {application.reviewedBy && (
                <p className={styles.reviewedBy}>by {application.reviewedBy.email}</p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirm.action && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmDialog}>
              <p>
                Are you sure you want to {showConfirm.action === 'accepted' ? 'accept' : 'reject'} this application?
              </p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.confirmBtn}
                  onClick={confirmStatusAction}
                >
                  Yes, {showConfirm.action === 'accepted' ? 'Accept' : 'Reject'}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirm({ action: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <button
              className={styles.actionButton}
              onClick={() => onStatusUpdate(application._id, 'reviewed', adminNote.trim() || undefined)}
              disabled={isLoading || application.status === 'reviewed'}
            >
              Mark Reviewed
            </button>
            <button
              className={`${styles.actionButton} ${styles.acceptButton}`}
              onClick={() => handleStatusAction('accepted')}
              disabled={isLoading || application.status === 'accepted'}
            >
              <Check size={16} />
              Accept
            </button>
            <button
              className={`${styles.actionButton} ${styles.rejectButton}`}
              onClick={() => handleStatusAction('rejected')}
              disabled={isLoading || application.status === 'rejected'}
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onEmail(application.email, application.jobTitle)}
            >
              <Mail size={16} />
              Send Email
            </button>
            {application.phone && (
              <button
                className={styles.actionButton}
                onClick={() => onWhatsApp(application.phone)}
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
