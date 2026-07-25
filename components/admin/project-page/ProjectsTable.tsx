'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff, CheckSquare, Square } from 'lucide-react'
import { type Project } from '@/services/admin/projects'
import styles from './ProjectsTable.module.css'

interface ProjectsTableProps {
  projects: Project[]
  loading: boolean
  selectedProjects: Set<string>
  onSelect: (id: string) => void
  onSelectAll: () => void
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  actionLoading: string | null
}

export default function ProjectsTable({
  projects,
  loading,
  selectedProjects,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  actionLoading
}: ProjectsTableProps) {
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

  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No projects found</p>
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
                {selectedProjects.size === projects.length ? (
                  <CheckSquare size={18} />
                ) : (
                  <Square size={18} />
                )}
              </button>
            </th>
            <th>Title</th>
            <th>Tag</th>
            <th>Year</th>
            <th>Status</th>
            <th>Created</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td className={styles.checkboxCol}>
                <button
                  type="button"
                  onClick={() => onSelect(project._id)}
                  className={styles.checkboxButton}
                  aria-label={`Select ${project.title}`}
                >
                  {selectedProjects.has(project._id) ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </td>
              <td>
                <div className={styles.titleCell}>
                  <strong>{project.title}</strong>
                  {project.slug && (
                    <span className={styles.slug}>/{project.slug}</span>
                  )}
                </div>
              </td>
              <td>
                <span className={styles.tag}>{project.tag}</span>
              </td>
              <td>{project.year || 'N/A'}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </td>
              <td>{formatDate(project.createdAt)}</td>
              <td className={styles.actionsCol}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className={styles.actionButton}
                    title="Edit"
                    disabled={actionLoading !== null}
                  >
                    <Edit size={16} />
                  </button>
                  {project.status === 'published' ? (
                    <button
                      type="button"
                      onClick={() => onUnpublish(project._id)}
                      className={styles.actionButton}
                      title="Unpublish"
                      disabled={actionLoading !== null}
                    >
                      <EyeOff size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPublish(project._id)}
                      className={styles.actionButton}
                      title="Publish"
                      disabled={actionLoading !== null}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(project._id)}
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
