'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  listInquiries,
  getInquiry,
  deleteInquiry,
  updateInquiryStatus,
  bulkUpdateInquiryStatus,
  type Inquiry,
  type ListInquiriesResponse
} from '@/services/admin/inquiries'
import { createCheckoutSession } from '@/services/stripe'
import { submitBillingInfo } from '@/services/inquiries'
import InquiryFilters from '@/components/admin/inquiries/InquiryFilters'
import InquiryList from '@/components/admin/inquiries/InquiryList'
import InquiryDetailsModal from '@/components/admin/inquiries/InquiryDetailsModal'
import styles from './inquiries.module.css'



export default function AdminInquiriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [clientTypeFilter, setClientTypeFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set())
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [statuses, setStatuses] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchInquiries = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        order: sortOrder
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (clientTypeFilter !== 'all') {
        params.clientType = clientTypeFilter
      }
      
      if (serviceFilter) {
        params.service = serviceFilter
      }
      
      if (paymentStatusFilter !== 'all') {
        params.paymentStatus = paymentStatusFilter
      }
      
      if (dateFrom) {
        params.dateFrom = dateFrom
      }
      
      if (dateTo) {
        params.dateTo = dateTo
      }
      
      if (searchQuery.trim()) {
        params.q = searchQuery.trim()
      }

      const response = await listInquiries(params)
      
      if (response.success && response.data) {
        const responseData = response.data as ListInquiriesResponse
        
        if (responseData) {
          setInquiries(Array.isArray(responseData.data) ? responseData.data : [])
          
          if (responseData.pagination) {
            setPagination(prev => {
              const newPagination = {
                page: responseData.pagination.page || prev.page || 1,
                limit: responseData.pagination.limit || prev.limit || 25,
                total: responseData.pagination.total || 0,
                totalPages: responseData.pagination.totalPages || 0
              }
              if (
                newPagination.page !== prev.page ||
                newPagination.limit !== prev.limit ||
                newPagination.total !== prev.total ||
                newPagination.totalPages !== prev.totalPages
              ) {
                return newPagination
              }
              return prev
            })
          }
          
          setStatuses(Array.isArray(responseData.filters?.statuses) ? responseData.filters.statuses : [])
          setServices(Array.isArray(responseData.filters?.services) ? responseData.filters.services : [])
        } else {
          setInquiries([])
          setStatuses([])
          setServices([])
          setError('Invalid response format from server')
        }
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load inquiries')
        setInquiries([])
        setStatuses([])
        setServices([])
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading inquiries')
      console.error('Inquiries error:', err)
      setInquiries([])
      setStatuses([])
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [statusFilter, clientTypeFilter, serviceFilter, paymentStatusFilter, dateFrom, dateTo, searchQuery, sortBy, sortOrder])
  
  // Fetch inquiries when pagination or filters change
  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchInquiries()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, clientTypeFilter, serviceFilter, paymentStatusFilter, dateFrom, dateTo, searchQuery, pagination.page, pagination.limit, sortBy, sortOrder])

  const handleView = (inquiry: Inquiry) => {
    setViewingInquiry(inquiry)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (id: string, status: string, adminNote?: string) => {
    setActionLoading(id)
    try {
      const response = await updateInquiryStatus(id, { status, adminNote })
      if (response.success) {
        await fetchInquiries()
        if (viewingInquiry && viewingInquiry._id === id) {
          // Update the viewing inquiry if it's the same one
          const updatedResponse = await getInquiry(id)
          if (updatedResponse.success && updatedResponse.data) {
            setViewingInquiry(updatedResponse.data)
          }
        }
      } else {
        alert(response.message || 'Failed to update status')
      }
    } catch (err) {
      alert('An error occurred while updating status')
      console.error('Status update error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return
    }
    
    setActionLoading(id)
    try {
      const response = await deleteInquiry(id)
      if (response.success) {
        await fetchInquiries()
        setSelectedInquiries(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        if (viewingInquiry && viewingInquiry._id === id) {
          setIsModalOpen(false)
          setViewingInquiry(null)
        }
      } else {
        alert(response.message || 'Failed to delete inquiry')
      }
    } catch (err) {
      alert('An error occurred while deleting inquiry')
      console.error('Delete error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkMarkReviewed = async () => {
    if (selectedInquiries.size === 0) return
    if (!confirm(`Are you sure you want to mark ${selectedInquiries.size} inquiry/inquiries as reviewed?`)) return
    
    setBulkActionLoading(true)
    try {
      const response = await bulkUpdateInquiryStatus(Array.from(selectedInquiries), 'reviewed')
      if (response.success) {
        await fetchInquiries()
        setSelectedInquiries(new Set())
      } else {
        alert(response.message || 'Failed to update inquiries')
      }
    } catch (err) {
      alert('An error occurred while updating inquiries')
      console.error('Bulk update error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedInquiries.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedInquiries.size} inquiry/inquiries? This action cannot be undone.`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedInquiries).map(id => deleteInquiry(id))
      await Promise.all(promises)
      await fetchInquiries()
      setSelectedInquiries(new Set())
    } catch (err) {
      alert('An error occurred while deleting inquiries')
      console.error('Bulk delete error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleCreateCheckoutSession = async (inquiryId: string) => {
    try {
      // Get inquiry details to determine duration and roadmapReport
      const inquiry = inquiries.find(i => i._id === inquiryId) || viewingInquiry
      if (!inquiry || !inquiry.consultationDetails) {
        alert('Consultation details not found')
        return
      }

      const response = await createCheckoutSession({
        inquiryId,
        duration: inquiry.consultationDetails.duration || '60',
        roadmapReport: inquiry.consultationDetails.roadmapReport || false
      })

      if (response.success && response.data) {
        // Redirect to Stripe checkout
        if (response.data.url) {
          window.location.href = response.data.url
        }
      } else {
        alert(response.message || 'Failed to create checkout session')
      }
    } catch (err) {
      alert('An error occurred while creating checkout session')
      console.error('Checkout session error:', err)
    }
  }

  const handleFinalizeInvoice = async (
    inquiryId: string,
    sessionId: string | null,
    billingData: any
  ) => {
    try {
      const response = await submitBillingInfo(inquiryId, sessionId, billingData)
      if (response.success) {
        await fetchInquiries()
        // Refresh viewing inquiry
        if (viewingInquiry && viewingInquiry._id === inquiryId) {
          const updatedResponse = await getInquiry(inquiryId)
          if (updatedResponse.success && updatedResponse.data) {
            setViewingInquiry(updatedResponse.data)
          }
        }
        alert('Invoice finalized successfully')
      } else {
        alert(response.message || 'Failed to finalize invoice')
      }
    } catch (err) {
      alert('An error occurred while finalizing invoice')
      console.error('Finalize invoice error:', err)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedInquiries(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedInquiries.size === inquiries.length) {
      setSelectedInquiries(new Set())
    } else {
      setSelectedInquiries(new Set(inquiries.map(i => i._id)))
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inquiries</h1>
          <p className={styles.subtitle}>
            Manage project inquiries, consultations, and client communications.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <InquiryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        clientTypeFilter={clientTypeFilter}
        onClientTypeFilterChange={setClientTypeFilter}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusFilterChange={setPaymentStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        statuses={statuses}
        services={services}
        selectedCount={selectedInquiries.size}
        onBulkMarkReviewed={handleBulkMarkReviewed}
        onBulkDelete={handleBulkDelete}
        bulkLoading={bulkActionLoading}
      />

      <InquiryList
        inquiries={inquiries}
        loading={loading}
        selectedInquiries={selectedInquiries}
        onSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onView={handleView}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />

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
            </select>
          </label>
        </div>
        {pagination.totalPages > 1 && (
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
        )}
      </div>

      <InquiryDetailsModal
        inquiry={viewingInquiry}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setViewingInquiry(null)
        }}
        onStatusChange={handleStatusChange}
        onCreateCheckoutSession={handleCreateCheckoutSession}
        onFinalizeInvoice={handleFinalizeInvoice}
        isLoading={actionLoading !== null}
      />
    </div>
  )
}
