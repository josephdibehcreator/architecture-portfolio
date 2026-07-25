'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import {
  listJobs,
  createJob,
  updateJob,
  publishJob,
  unpublishJob,
  archiveJob,
  deleteJob,
  type Job,
  type CreateJobData,
} from '@/services/admin/adminjobs'
import AdminJobsTable from '@/components/admin/career-page/AdminJobsTable'
import AdminJobForm from '@/components/admin/career-page/AdminJobForm'
import styles from './careers.module.css'



export default function AdminCareersPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await listJobs()
      if (response.success && response.data) {
        setJobs(response.data)
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load careers')
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      console.error('Careers error:', err)
      setError('An error occurred while loading careers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateClick = () => {
    setEditingJob(null)
    setIsFormOpen(true)
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (payload: CreateJobData, id?: string) => {
    setActionLoading(id || 'new')
    try {
      if (id) {
        await updateJob(id, payload)
      } else {
        await createJob(payload)
      }
      setIsFormOpen(false)
      setEditingJob(null)
      await fetchJobs()
    } catch (err) {
      console.error('Save career error:', err)
      alert('Failed to save career opening')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (id: string) => {
    setActionLoading(id)
    try {
      await publishJob(id)
      await fetchJobs()
    } catch (err) {
      console.error('Publish career error:', err)
      alert('Failed to publish career')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: string) => {
    setActionLoading(id)
    try {
      await unpublishJob(id)
      await fetchJobs()
    } catch (err) {
      console.error('Unpublish career error:', err)
      alert('Failed to unpublish career')
    } finally {
      setActionLoading(null)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this career opening? It will be hidden but kept in the database.')) return
    setActionLoading(id)
    try {
      await archiveJob(id)
      await fetchJobs()
    } catch (err) {
      console.error('Archive career error:', err)
      alert('Failed to archive career')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this career opening? This cannot be undone.')) return
    setActionLoading(id)
    try {
      await deleteJob(id)
      await fetchJobs()
    } catch (err) {
      console.error('Delete career error:', err)
      alert('Failed to delete career')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Careers</h1>
          <p className={styles.subtitle}>
            Publish and manage open positions. Public careers are synced with the portfolio Careers section.
          </p>
        </div>
        <button type="button" className={styles.bulkBtn} onClick={handleCreateClick}>
          <Plus size={16} />
          Create career
        </button>
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      <AdminJobsTable
        jobs={jobs}
        loading={loading}
        onEdit={handleEdit}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onArchive={handleArchive}
        onDelete={handleDelete}
        actionLoading={actionLoading}
      />

      <AdminJobForm
        job={editingJob}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingJob(null)
        }}
        onSubmit={handleFormSubmit}
        loading={actionLoading !== null}
      />
    </div>
  )
}

