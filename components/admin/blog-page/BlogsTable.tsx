'use client'

import { Edit, Trash2, Eye, EyeOff, CheckSquare, Square } from 'lucide-react'
import { type Blog } from '@/services/admin/blogs'
import styles from './BlogsTable.module.css'

interface BlogsTableProps {
  blogs: Blog[]
  loading: boolean
  selectedBlogs: Set<string>
  onSelect: (id: string) => void
  onSelectAll: () => void
  onEdit: (blog: Blog) => void
  onDelete: (id: string) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  actionLoading: string | null
}

export default function BlogsTable({
  blogs,
  loading,
  selectedBlogs,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  actionLoading
}: BlogsTableProps) {
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

  if (blogs.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No blogs found</p>
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
                {selectedBlogs.size === blogs.length ? (
                  <CheckSquare size={18} />
                ) : (
                  <Square size={18} />
                )}
              </button>
            </th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Created</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td className={styles.checkboxCol}>
                <button
                  type="button"
                  onClick={() => onSelect(blog._id)}
                  className={styles.checkboxButton}
                  aria-label={`Select ${blog.title}`}
                >
                  {selectedBlogs.has(blog._id) ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </td>
              <td>
                <div className={styles.titleCell}>
                  <strong>{blog.title}</strong>
                  {blog.slug && (
                    <span className={styles.slug}>/{blog.slug}</span>
                  )}
                </div>
              </td>
              <td>
                <span className={styles.category}>{blog.category}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(blog.status)}`}>
                  {getStatusLabel(blog.status)}
                </span>
              </td>
              <td>{formatDate(blog.createdAt)}</td>
              <td className={styles.actionsCol}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(blog)}
                    className={styles.actionButton}
                    title="Edit"
                    disabled={actionLoading !== null}
                  >
                    <Edit size={16} />
                  </button>
                  {blog.status === 'published' ? (
                    <button
                      type="button"
                      onClick={() => onUnpublish(blog._id)}
                      className={styles.actionButton}
                      title="Unpublish"
                      disabled={actionLoading !== null}
                    >
                      <EyeOff size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPublish(blog._id)}
                      className={styles.actionButton}
                      title="Publish"
                      disabled={actionLoading !== null}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(blog._id)}
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
