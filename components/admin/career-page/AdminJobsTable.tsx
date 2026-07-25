'use client'

import { Edit, Eye, EyeOff, Archive, Trash2 } from 'lucide-react'
import { type Job } from '@/services/admin/adminjobs'
import styles from './AdminJobsTable.module.css'

interface AdminJobsTableProps {
  jobs: Job[]
  loading: boolean
  onEdit: (job: Job) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  actionLoading: string | null
}

export default function AdminJobsTable({
  jobs,
  loading,
  onEdit,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
  actionLoading,
}: AdminJobsTableProps) {
  const formatStatus = (status: string) => {
    if (status === 'published') return 'Published'
    if (status === 'archived') return 'Archived'
    return 'Draft'
  }

  const getStatusClass = (status: string) => {
    if (status === 'published') return styles.statusPublished
    if (status === 'archived') return styles.statusArchived
    return styles.statusDraft
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
        <div className={styles.skeletonRow} />
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className={styles.empty}>
        <p>No careers found. Create your first opening to get started.</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Location</th>
            <th>Type</th>
            <th>Work Mode</th>
            <th>Ordering</th>
            <th>Status</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>
                <div className={styles.titleCell}>
                  <span className={styles.title}>{job.title}</span>
                </div>
              </td>
              <td>
                <span className={styles.meta}>{job.location}</span>
              </td>
              <td>
                <span className={styles.meta}>{job.jobType}</span>
              </td>
              <td>
                <span className={styles.meta}>{job.workMode}</span>
              </td>
              <td>
                <span className={styles.ordering}>#{job.orderingIndex ?? 0}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(job.status)}`}>
                  {formatStatus(job.status)}
                </span>
              </td>
              <td className={styles.actionsCol}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    title="Edit"
                    onClick={() => onEdit(job)}
                    disabled={actionLoading !== null}
                  >
                    <Edit size={16} />
                  </button>
                  {job.status === 'published' ? (
                    <button
                      type="button"
                      className={styles.actionButton}
                      title="Unpublish"
                      onClick={() => onUnpublish(job._id)}
                      disabled={actionLoading !== null}
                    >
                      <EyeOff size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.actionButton}
                      title="Publish"
                      onClick={() => onPublish(job._id)}
                      disabled={actionLoading !== null}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {job.status !== 'archived' && (
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.archiveButton}`}
                      title="Archive"
                      onClick={() => onArchive(job._id)}
                      disabled={actionLoading !== null}
                    >
                      <Archive size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete permanently"
                    onClick={() => onDelete(job._id)}
                    disabled={actionLoading !== null}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

