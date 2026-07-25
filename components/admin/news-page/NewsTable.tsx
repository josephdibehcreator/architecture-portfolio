'use client'

import { Edit, Trash2, Eye, EyeOff, CheckSquare, Square } from 'lucide-react'
import { type News } from '@/services/admin/news'
import styles from './NewsTable.module.css'

interface NewsTableProps {
  news: News[]
  loading: boolean
  selectedNews: Set<string>
  onSelect: (id: string) => void
  onSelectAll: () => void
  onEdit: (news: News) => void
  onDelete: (id: string) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  actionLoading: string | null
}

export default function NewsTable({
  news,
  loading,
  selectedNews,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  actionLoading
}: NewsTableProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadgeClass = (status: string) => {
    return status === 'published' ? styles.statusPublished : styles.statusDraft
  }

  const getStatusLabel = (status: string) => {
    return status === 'published' ? 'Published' : 'Draft'
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.skeletonRow}></div>
        <div className={styles.skeletonRow}></div>
        <div className={styles.skeletonRow}></div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No news found</p>
      </div>
    )
  }

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
                {selectedNews.size === news.length ? (
                  <CheckSquare size={18} />
                ) : (
                  <Square size={18} />
                )}
              </button>
            </th>
            <th>Title</th>
            <th>Source</th>
            <th>Status</th>
            <th>Published</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((newsItem) => (
            <tr key={newsItem._id}>
              <td className={styles.checkboxCol}>
                <button
                  type="button"
                  onClick={() => onSelect(newsItem._id)}
                  className={styles.checkboxButton}
                  aria-label={`Select ${newsItem.title}`}
                >
                  {selectedNews.has(newsItem._id) ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </td>
              <td>
                <div className={styles.titleCell}>
                  <strong>{newsItem.title}</strong>
                  {newsItem.slug && (
                    <span className={styles.slug}>/{newsItem.slug}</span>
                  )}
                </div>
              </td>
              <td>
                <span className={styles.source}>{newsItem.source}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(newsItem.status)}`}>
                  {getStatusLabel(newsItem.status)}
                </span>
              </td>
              <td>{formatDate(newsItem.publishedAt)}</td>
              <td className={styles.actionsCol}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(newsItem)}
                    className={styles.actionButton}
                    title="Edit"
                    disabled={actionLoading !== null}
                  >
                    <Edit size={16} />
                  </button>
                  {newsItem.status === 'published' ? (
                    <button
                      type="button"
                      onClick={() => onUnpublish(newsItem._id)}
                      className={styles.actionButton}
                      title="Unpublish"
                      disabled={actionLoading !== null}
                    >
                      <EyeOff size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPublish(newsItem._id)}
                      className={styles.actionButton}
                      title="Publish"
                      disabled={actionLoading !== null}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(newsItem._id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete"
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
