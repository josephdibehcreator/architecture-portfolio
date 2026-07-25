'use client'

import { CheckSquare, Square } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import InquiryRow from './InquiryRow'
import styles from './InquiryList.module.css'

interface InquiryListProps {
  inquiries: Inquiry[]
  loading: boolean
  selectedInquiries: Set<string>
  onSelect: (id: string) => void
  onSelectAll: () => void
  onView: (inquiry: Inquiry) => void
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  actionLoading: string | null
}

export default function InquiryList({
  inquiries,
  loading,
  selectedInquiries,
  onSelect,
  onSelectAll,
  onView,
  onStatusChange,
  onDelete,
  actionLoading
}: InquiryListProps) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeletonRow}></div>
        <div className={styles.skeletonRow}></div>
        <div className={styles.skeletonRow}></div>
      </div>
    )
  }

  if (inquiries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No inquiries found</p>
      </div>
    )
  }

  const allSelected = inquiries.length > 0 && selectedInquiries.size === inquiries.length

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <button
                type="button"
                onClick={onSelectAll}
                className={styles.checkboxButton}
                aria-label="Select all"
              >
                {allSelected ? (
                  <CheckSquare size={18} />
                ) : (
                  <Square size={18} />
                )}
              </button>
            </th>
            <th>Created</th>
            <th>Client</th>
            <th>Contact</th>
            <th>Services</th>
            <th>Project Details</th>
            <th>Status</th>
            <th>Payment</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <InquiryRow
              key={inquiry._id}
              inquiry={inquiry}
              isSelected={selectedInquiries.has(inquiry._id)}
              onSelect={onSelect}
              onView={onView}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              actionLoading={actionLoading}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
