'use client'

import { Plus, Search, Filter } from 'lucide-react'
import styles from './BlogsToolbar.module.css'

interface BlogsToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | 'draft' | 'published'
  onStatusFilterChange: (value: 'all' | 'draft' | 'published') => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]
  onCreateClick: () => void
  selectedCount: number
  onBulkPublish?: () => void
  onBulkUnpublish?: () => void
  onBulkDelete?: () => void
  bulkLoading?: boolean
}

export default function BlogsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  onCreateClick,
  selectedCount,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete,
  bulkLoading = false
}: BlogsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <button
          type="button"
          onClick={onCreateClick}
          className={styles.createButton}
        >
          <Plus size={18} />
          Create Blog
        </button>
      </div>

      <div className={styles.center}>
        <div className={styles.searchGroup}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'draft' | 'published')}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {categories.length > 0 && (
          <div className={styles.filterGroup}>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}

        {selectedCount > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>{selectedCount} selected</span>
            {onBulkPublish && (
              <button
                type="button"
                onClick={onBulkPublish}
                className={styles.bulkButton}
                disabled={bulkLoading}
              >
                Publish
              </button>
            )}
            {onBulkUnpublish && (
              <button
                type="button"
                onClick={onBulkUnpublish}
                className={styles.bulkButton}
                disabled={bulkLoading}
              >
                Unpublish
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
