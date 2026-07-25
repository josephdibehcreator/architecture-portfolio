'use client'

import { Search, Filter } from 'lucide-react'
import styles from './InquiryFilters.module.css'

interface InquiryFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  clientTypeFilter: string
  onClientTypeFilterChange: (value: string) => void
  serviceFilter: string
  onServiceFilterChange: (value: string) => void
  paymentStatusFilter: string
  onPaymentStatusFilterChange: (value: string) => void
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
  statuses: string[]
  services: string[]
  selectedCount: number
  onBulkMarkReviewed?: () => void
  onBulkDelete?: () => void
  bulkLoading?: boolean
}

export default function InquiryFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  clientTypeFilter,
  onClientTypeFilterChange,
  serviceFilter,
  onServiceFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  statuses,
  services,
  selectedCount,
  onBulkMarkReviewed,
  onBulkDelete,
  bulkLoading = false
}: InquiryFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.left}>
        <div className={styles.searchGroup}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={clientTypeFilter}
            onChange={(e) => onClientTypeFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Client Types</option>
            <option value="private">Private</option>
            <option value="business">Business</option>
          </select>
        </div>

        {services.length > 0 && (
          <div className={styles.filterGroup}>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.filterGroup}>
          <select
            value={paymentStatusFilter}
            onChange={(e) => onPaymentStatusFilterChange(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Payment Status</option>
            <option value="none">None</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className={styles.dateRangeGroup}>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={styles.dateInput}
            placeholder="From"
          />
          <span className={styles.dateSeparator}>to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={styles.dateInput}
            placeholder="To"
          />
        </div>
      </div>

      <div className={styles.right}>
        {selectedCount > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>{selectedCount} selected</span>
            {onBulkMarkReviewed && (
              <button
                type="button"
                onClick={onBulkMarkReviewed}
                className={styles.bulkButton}
                disabled={bulkLoading}
              >
                Mark Reviewed
              </button>
            )}
            {onBulkDelete && (
              <button
                type="button"
                onClick={onBulkDelete}
                className={`${styles.bulkButton} ${styles.deleteButton}`}
                disabled={bulkLoading}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
