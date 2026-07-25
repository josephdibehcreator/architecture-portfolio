'use client'

import { useEffect, useState } from 'react'
import { 
  Eye, 
  Check, 
  X, 
  Trash2,
  MessageCircle, 
  Mail,
  Search,
  Filter
} from 'lucide-react'
import { getAdminTestimonials, approveTestimonial, rejectTestimonial, deleteAdminTestimonial, type Testimonial } from '@/services/testimonials'
import TestimonialModal from '@/components/admin/TestimonialModal'
import styles from './testimonials.module.css'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'



export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  })
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: {
        status?: 'pending' | 'approved' | 'rejected'
        search?: string
        page?: number
        limit?: number
      } = {}
      if (statusFilter !== 'all') {
        params.status = statusFilter as 'pending' | 'approved' | 'rejected'
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      params.page = page
      params.limit = 20

      const response = await getAdminTestimonials(params)
      if (response.success && response.data) {
        setTestimonials(Array.isArray(response.data.data) ? response.data.data : [])
        if (response.data.pagination) {
          setPagination({
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          })
        }
      } else {
        setError(response.message || 'Failed to load testimonials')
      }
    } catch (err) {
      setError('An error occurred while loading testimonials')
      console.error('Testimonials error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, searchQuery])

  useEffect(() => {
    fetchTestimonials()
  }, [statusFilter, debouncedSearch, page])

  const handleApprove = async (id: string) => {
    if (!id) return
    
    setActionLoading(id)
    try {
      const response = await approveTestimonial(id)
      if (response.success) {
        await fetchTestimonials()
        if (selectedTestimonial?._id === id) {
          setSelectedTestimonial(response.data || null)
        }
      } else {
        alert(response.message || 'Failed to approve testimonial')
      }
    } catch (err) {
      alert('An error occurred while approving testimonial')
      console.error('Approve error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!id) return
    
    if (!confirm('Are you sure you want to reject this testimonial?')) {
      return
    }
    
    setActionLoading(id)
    try {
      const response = await rejectTestimonial(id)
      if (response.success) {
        await fetchTestimonials()
        if (selectedTestimonial?._id === id) {
          setSelectedTestimonial(response.data || null)
        }
      } else {
        alert(response.message || 'Failed to reject testimonial')
      }
    } catch (err) {
      alert('An error occurred while rejecting testimonial')
      console.error('Reject error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return

    if (!window.confirm('Delete this testimonial? This cannot be undone.')) {
      return
    }

    setDeleteLoading(id)
    try {
      const response = await deleteAdminTestimonial(id)
      if (response.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id))
        if (selectedTestimonial?._id === id) {
          setIsModalOpen(false)
          setSelectedTestimonial(null)
        }
      } else {
        alert(response.message || 'Failed to delete testimonial')
      }
    } catch (err) {
      alert('An error occurred while deleting testimonial')
      console.error('Delete error:', err)
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleView = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const handleWhatsApp = (phoneNumber: string | null | undefined) => {
    if (!phoneNumber) return
    // Remove any non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank')
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Testimonials</h1>
          <p className={styles.subtitle}>Review and manage customer testimonials</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${statusFilter === 'all' ? styles.active : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === 'pending' ? styles.active : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === 'approved' ? styles.active : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`${styles.filterTab} ${statusFilter === 'rejected' ? styles.active : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Testimonials Table */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          {testimonials.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Project Type</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id}>
                    <td className={styles.nameCell}>{testimonial.fullName}</td>
                    <td>{testimonial.email}</td>
                    <td>{testimonial.phoneNumber || 'N/A'}</td>
                    <td>{testimonial.projectType || 'N/A'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(testimonial.status)}`}>
                        {getStatusLabel(testimonial.status)}
                      </span>
                    </td>
                    <td>{formatDate(testimonial.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleView(testimonial)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {testimonial.status !== 'approved' && (
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleApprove(testimonial._id!)}
                            disabled={actionLoading === testimonial._id}
                            title="Approve"
                          >
                            {actionLoading === testimonial._id ? (
                              <div className={styles.spinner}></div>
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                        )}
                        {testimonial.status !== 'rejected' && (
                          <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => handleReject(testimonial._id!)}
                            disabled={actionLoading === testimonial._id}
                            title="Reject"
                          >
                            {actionLoading === testimonial._id ? (
                              <div className={styles.spinner}></div>
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(testimonial._id!)}
                          disabled={deleteLoading === testimonial._id}
                          title="Delete"
                          aria-label="Delete testimonial"
                        >
                          {deleteLoading === testimonial._id ? (
                            <div className={styles.spinner}></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                        {testimonial.phoneNumber && (
                          <button
                            className={`${styles.actionBtn} ${styles.whatsappBtn}`}
                            onClick={() => handleWhatsApp(testimonial.phoneNumber)}
                            title="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.emailBtn}`}
                          onClick={() => handleEmail(testimonial.email)}
                          title="Email"
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p>No testimonials found</p>
              {statusFilter !== 'all' && (
                <button
                  className={styles.clearFilterBtn}
                  onClick={() => setStatusFilter('all')}
                >
                  View all testimonials
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>
          <span>Page {page} of {pagination.totalPages} ({pagination.total} total)</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages || loading}
          >
            Next
          </button>
        </div>
      )}

      {/* Testimonial Modal */}
      {isModalOpen && selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTestimonial(null)
          }}
          onApprove={() => {
            if (selectedTestimonial._id) {
              handleApprove(selectedTestimonial._id)
            }
          }}
          onReject={() => {
            if (selectedTestimonial._id) {
              handleReject(selectedTestimonial._id)
            }
          }}
          onWhatsApp={() => handleWhatsApp(selectedTestimonial.phoneNumber)}
          onEmail={() => handleEmail(selectedTestimonial.email)}
          isLoading={actionLoading === selectedTestimonial._id}
        />
      )}
    </div>
  )
}
