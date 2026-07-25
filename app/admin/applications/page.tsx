'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Check,
  X,
  Mail,
  MessageCircle,
  Download,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from 'lucide-react'
import {
  listApplications,
  updateApplicationStatus,
  bulkUpdateStatus,
  exportApplications,
  getDownloadUrl,
  type CareerApplication,
  type ListApplicationsResponse,
} from '@/services/admin/careersApplication'
import {
  getCareerAutoReplyTemplate,
  updateCareerAutoReplyTemplate,
  type CareerAutoReplyTemplate,
} from '@/services/admin/settings'
import ApplicationModal from '@/components/admin/career/ApplicationModal'
import styles from './applications.module.css'

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'

export default function AdminCareerApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [jobTitleFilter, setJobTitleFilter] = useState('')
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set())
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  })
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [template, setTemplate] = useState<CareerAutoReplyTemplate | null>(null)
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateBodyHtml, setTemplateBodyHtml] = useState('')
  const [templateError, setTemplateError] = useState<string | null>(null)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateSaving, setTemplateSaving] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        order: sortOrder,
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      if (searchQuery.trim()) {
        params.q = searchQuery.trim()
      }

      if (jobTitleFilter) {
        params.jobTitle = jobTitleFilter
      }

      const response = await listApplications(params)

      if (response.success && response.data) {
        const responseData = response.data as ListApplicationsResponse

        if (!responseData || typeof responseData !== 'object') {
          console.error('Invalid response data structure:', responseData)
          setError('Invalid response format from server')
          setApplications([])
          setJobTitles([])
          return
        }

        if (responseData) {
          setApplications(Array.isArray(responseData.data) ? responseData.data : [])

          if (responseData.pagination) {
            setPagination((prev) => {
              const newPagination = {
                page: responseData.pagination.page || prev.page || 1,
                limit: responseData.pagination.limit || prev.limit || 25,
                total: responseData.pagination.total || 0,
                totalPages: responseData.pagination.totalPages || 0,
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
          } else {
            setPagination((prev) => ({
              ...prev,
              total: 0,
              totalPages: 0,
            }))
          }

          setJobTitles(Array.isArray(responseData.filters?.jobTitles) ? responseData.filters.jobTitles : [])
        } else {
          setApplications([])
          setJobTitles([])
          setError('Invalid response format from server')
        }
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load applications')
        setApplications([])
        setJobTitles([])
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading applications')
      console.error('Applications error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [statusFilter, searchQuery, jobTitleFilter, sortBy, sortOrder])

  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchApplications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, jobTitleFilter, pagination.page, pagination.limit, sortBy, sortOrder])

  const handleStatusUpdate = async (id: string, status: CareerApplication['status'], adminNote?: string) => {
    if (!id) return

    setActionLoading(id)
    try {
      const response = await updateApplicationStatus(id, { status, adminNote })
      if (response.success) {
        await fetchApplications()
        if (selectedApplication?._id === id) {
          setSelectedApplication(response.data || null)
        }
        setSelectedApplications((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      } else {
        alert(response.message || 'Failed to update application status')
      }
    } catch (err) {
      alert('An error occurred while updating application status')
      console.error('Update error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkStatusUpdate = async (status: CareerApplication['status']) => {
    if (selectedApplications.size === 0) return

    const confirmMessage = `Are you sure you want to ${status} ${selectedApplications.size} application(s)?`
    if (!confirm(confirmMessage)) return

    setBulkActionLoading(true)
    try {
      const response = await bulkUpdateStatus({
        ids: Array.from(selectedApplications),
        status,
      })

      if (response.success) {
        await fetchApplications()
        setSelectedApplications(new Set())
        alert(`Successfully updated ${response.data?.updated || 0} application(s)`)
      } else {
        alert(response.message || 'Failed to update applications')
      }
    } catch (err) {
      alert('An error occurred while updating applications')
      console.error('Bulk update error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      let blob: Blob

      if (selectedApplications.size > 0) {
        blob = await exportApplications({ ids: Array.from(selectedApplications) })
      } else if (statusFilter !== 'all') {
        blob = await exportApplications({ status: statusFilter })
      } else {
        blob = await exportApplications()
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `career-applications-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export applications')
      console.error('Export error:', err)
    }
  }

  const handleView = async (application: CareerApplication) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleEmail = (email: string, jobTitle: string) => {
    const subject = encodeURIComponent(`Re: Application for ${jobTitle}`)
    window.location.href = `mailto:${email}?subject=${subject}`
  }

  const handleWhatsApp = (phone: string | undefined) => {
    if (!phone) return
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    window.open(`https://wa.me/${cleanPhone}`, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = (id: string, type: 'cv' | 'portfolio') => {
    const url = getDownloadUrl(id, type)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const toggleSelect = (id: string) => {
    setSelectedApplications((prev) => {
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
    if (selectedApplications.size === applications.length) {
      setSelectedApplications(new Set())
    } else {
      setSelectedApplications(new Set(applications.map((app) => app._id)))
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const openTemplateModal = async () => {
    setIsTemplateModalOpen(true)
    setTemplateError(null)
    setTemplateLoading(true)
    try {
      const response = await getCareerAutoReplyTemplate()
      if (response.success && response.data) {
        setTemplate(response.data)
        setTemplateSubject(response.data.subject || '')
        setTemplateBodyHtml(response.data.bodyHtml || '')
      } else {
        setTemplateError(response.message || 'Failed to load auto-reply template')
      }
    } catch (err) {
      console.error('Error loading auto-reply template:', err)
      setTemplateError('An error occurred while loading the auto-reply template')
    } finally {
      setTemplateLoading(false)
    }
  }

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false)
    setTemplateError(null)
    setTemplateSaving(false)
  }

  const handleTemplateSave = async () => {
    if (!templateSubject.trim() || !templateBodyHtml.trim()) {
      setTemplateError('Subject and body are required')
      return
    }

    setTemplateSaving(true)
    setTemplateError(null)

    try {
      const response = await updateCareerAutoReplyTemplate({
        subject: templateSubject,
        bodyHtml: templateBodyHtml,
        bodyText: undefined,
      })

      if (response.success && response.data) {
        setTemplate(response.data)
        closeTemplateModal()
      } else {
        setTemplateError(response.message || 'Failed to save auto-reply template')
      }
    } catch (err) {
      console.error('Error saving auto-reply template:', err)
      setTemplateError('An error occurred while saving the auto-reply template')
    } finally {
      setTemplateSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Career Applications</h1>
          <p className={styles.subtitle}>
            Review, download CVs/portfolios, contact applicants, and update status.
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <button
            className={styles.bulkBtn}
            type="button"
            onClick={openTemplateModal}
          >
            Edit Auto-Reply Email
          </button>
        </div>
      </div>

      {selectedApplications.size > 0 && (
        <div className={styles.bulkToolbar}>
          <span className={styles.bulkCount}>{selectedApplications.size} selected</span>
          <div className={styles.bulkActions}>
            <button
              className={styles.bulkBtn}
              onClick={() => handleBulkStatusUpdate('reviewed')}
              disabled={bulkActionLoading}
            >
              Mark Reviewed
            </button>
            <button
              className={`${styles.bulkBtn} ${styles.acceptBtn}`}
              onClick={() => handleBulkStatusUpdate('accepted')}
              disabled={bulkActionLoading}
            >
              Accept Selected
            </button>
            <button
              className={`${styles.bulkBtn} ${styles.rejectBtn}`}
              onClick={() => handleBulkStatusUpdate('rejected')}
              disabled={bulkActionLoading}
            >
              Reject Selected
            </button>
            <button className={styles.bulkBtn} onClick={handleExport} disabled={bulkActionLoading}>
              Export to CSV
            </button>
            <button className={styles.bulkBtn} onClick={() => setSelectedApplications(new Set())}>
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterRow}>
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
              className={`${styles.filterTab} ${statusFilter === 'reviewed' ? styles.active : ''}`}
              onClick={() => setStatusFilter('reviewed')}
            >
              Reviewed
            </button>
            <button
              className={`${styles.filterTab} ${statusFilter === 'accepted' ? styles.active : ''}`}
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </button>
            <button
              className={`${styles.filterTab} ${statusFilter === 'rejected' ? styles.active : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </button>
          </div>

          {jobTitles.length > 0 && (
            <select
              value={jobTitleFilter}
              onChange={(e) => setJobTitleFilter(e.target.value)}
              className={styles.jobTitleSelect}
            >
              <option value="">All Job Titles</option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          )}

          <div className={styles.paginationControls}>
            <select
              value={pagination.limit}
              onChange={(e) =>
                setPagination((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }))
              }
              className={styles.limitSelect}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader} />
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.tableContainer}>
          {applications.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCol}>
                    <button
                      className={styles.checkboxBtn}
                      onClick={toggleSelectAll}
                      title="Select all"
                    >
                      {selectedApplications.size === applications.length ? (
                        <CheckSquare size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortBtn} onClick={() => handleSort('fullName')}>
                      Applicant Name
                      {sortBy === 'fullName' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortBtn} onClick={() => handleSort('email')}>
                      Email
                      {sortBy === 'email' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortBtn} onClick={() => handleSort('jobTitle')}>
                      Job Title
                      {sortBy === 'jobTitle' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th>
                    <button className={styles.sortBtn} onClick={() => handleSort('status')}>
                      Status
                      {sortBy === 'status' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th>CV</th>
                  <th>
                    <button className={styles.sortBtn} onClick={() => handleSort('createdAt')}>
                      Applied At
                      {sortBy === 'createdAt' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className={styles.checkboxCol}>
                      <button
                        className={styles.checkboxBtn}
                        onClick={() => toggleSelect(application._id)}
                        title="Select"
                      >
                        {selectedApplications.has(application._id) ? (
                          <CheckSquare size={18} />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td className={styles.nameCell}>{application.fullName}</td>
                    <td>{application.email}</td>
                    <td>{application.jobTitle}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
                        {getStatusLabel(application.status)}
                      </span>
                    </td>
                    <td>
                      {application.cvUrl ? (
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleDownload(application._id, 'cv')}
                          title="Download CV"
                        >
                          <FileText size={16} />
                        </button>
                      ) : (
                        <span className={styles.noFile}>—</span>
                      )}
                    </td>
                    <td>{formatDate(application.createdAt)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleView(application)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {application.status !== 'accepted' && (
                          <button
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => {
                              if (confirm('Accept this application?')) {
                                handleStatusUpdate(application._id, 'accepted')
                              }
                            }}
                            disabled={actionLoading === application._id}
                            title="Accept"
                          >
                            {actionLoading === application._id ? (
                              <div className={styles.spinner} />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                        )}
                        {application.status !== 'rejected' && (
                          <button
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => {
                              if (confirm('Reject this application?')) {
                                handleStatusUpdate(application._id, 'rejected')
                              }
                            }}
                            disabled={actionLoading === application._id}
                            title="Reject"
                          >
                            {actionLoading === application._id ? (
                              <div className={styles.spinner} />
                            ) : (
                              <X size={16} />
                            )}
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.emailBtn}`}
                          onClick={() => handleEmail(application.email, application.jobTitle)}
                          title="Email"
                        >
                          <Mail size={16} />
                        </button>
                        {application.phone && (
                          <button
                            className={`${styles.actionBtn} ${styles.whatsappBtn}`}
                            onClick={() => handleWhatsApp(application.phone)}
                            title="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                        )}
                        {application.cvUrl && (
                          <button
                            className={`${styles.actionBtn} ${styles.downloadBtn}`}
                            onClick={() => handleDownload(application._id, 'cv')}
                            title="Download CV"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p>No applications found</p>
              {(statusFilter !== 'all' || searchQuery || jobTitleFilter) && (
                <button
                  className={styles.clearFilterBtn}
                  onClick={() => {
                    setStatusFilter('all')
                    setSearchQuery('')
                    setJobTitleFilter('')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            className={styles.paginationBtn}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {isModalOpen && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedApplication(null)
          }}
          onStatusUpdate={handleStatusUpdate}
          onEmail={handleEmail}
          onWhatsApp={handleWhatsApp}
          onDownload={handleDownload}
          isLoading={actionLoading === selectedApplication._id}
        />
      )}

      {isTemplateModalOpen && (
        <div className={styles.tableContainer}>
          <div
            className={styles.templateModalOverlay}
            onClick={closeTemplateModal}
          >
            <div
              className={styles.templateModal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.templateModalTitle}>Edit Auto-Reply Email</h2>
              <p className={styles.templateModalDescription}>
                Configure the automatic email sent to applicants after they submit their application.
              </p>

              {templateError && (
                <div className={styles.templateError}>
                  {templateError}
                </div>
              )}

              {templateLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                  Loading template...
                </div>
              ) : (
                <>
                  <div className={styles.templateFieldGroup}>
                    <label className={styles.templateFieldLabel}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={templateSubject}
                      onChange={(e) => setTemplateSubject(e.target.value)}
                      className={styles.templateInput}
                    />
                  </div>

                  <div className={styles.templateFieldGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.templateFieldLabel}>
                      HTML Body
                    </label>
                    <textarea
                      rows={10}
                      value={templateBodyHtml}
                      onChange={(e) => setTemplateBodyHtml(e.target.value)}
                      className={styles.templateTextarea}
                    />
                  </div>

                  <div className={styles.templatePlaceholders}>
                    <p style={{ marginBottom: '0.25rem', fontWeight: 500 }}>Available placeholders:</p>
                    <ul className={styles.templatePlaceholderList}>
                      <li><code>{'{{fullName}}'}</code> – Applicant full name</li>
                      <li><code>{'{{jobTitle}}'}</code> – Job title / position</li>
                      <li><code>{'{{companyName}}'}</code> – Company name</li>
                    </ul>
                  </div>

                  <div className={styles.templateModalFooter}>
                    <button
                      type="button"
                      onClick={closeTemplateModal}
                      className={styles.templateCancelBtn}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleTemplateSave}
                      disabled={templateSaving}
                      className={styles.templateSaveBtn}
                    >
                      {templateSaving ? 'Saving...' : 'Save Template'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

