'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { type News, createNews, updateNews } from '@/services/admin/news'
import { getApiBaseUrl } from '@/services/api'
import styles from './NewsForm.module.css'

interface NewsFormProps {
  news?: News | null
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  loading?: boolean
}

export default function NewsForm({
  news,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    publishedAt: '',
    status: 'draft' as 'draft' | 'published'
  })

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deletedCoverImage, setDeletedCoverImage] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (coverImagePreview && typeof coverImagePreview === 'string' && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview)
      }
    }
  }, [coverImagePreview])

  // Initialize form when news changes or modal opens/closes
  useEffect(() => {
    if (!news || !news._id) {
      // Reset form for new news
      const now = new Date()
      const defaultDate = now.toISOString().split('T')[0] // YYYY-MM-DD format
      
      setFormData({
        title: '',
        source: '',
        excerpt: '',
        content: '',
        coverImageUrl: '',
        publishedAt: defaultDate,
        status: 'draft'
      })
      setCoverImagePreview(null)
      setCoverImageFile(null)
      setDeletedCoverImage(false)
      setErrors({})
      return
    }

    // TypeScript: news is guaranteed to be non-null here after the check
    const currentNews = news
    const publishedDate = currentNews.publishedAt 
      ? new Date(currentNews.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    
    setFormData({
      title: currentNews.title || '',
      source: currentNews.source || '',
      excerpt: currentNews.excerpt || '',
      content: currentNews.content || '',
      coverImageUrl: currentNews.coverImage?.url || '',
      publishedAt: publishedDate,
      status: currentNews.status || 'draft'
    })
    setCoverImagePreview(currentNews.coverImage?.url || null)
    setCoverImageFile(null)
    setDeletedCoverImage(false)
    setErrors({})
  }, [news, isOpen])

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select an image file' }))
      return
    }

    setCoverImageFile(file)
    setDeletedCoverImage(false)
    
    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setCoverImagePreview(previewUrl)
    setErrors(prev => {
      const next = { ...prev }
      delete next.coverImage
      return next
    })
  }

  const handleRemoveCoverImage = () => {
    // Revoke blob URL if it's a blob
    if (coverImagePreview && typeof coverImagePreview === 'string' && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    
    setCoverImageFile(null)
    setCoverImagePreview(null)
    setDeletedCoverImage(news && news.coverImage ? true : false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.source.trim()) {
      newErrors.source = 'Source is required'
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    // Cover image validation
    if (!coverImageFile && !formData.coverImageUrl.trim() && !coverImagePreview && !news?.coverImage) {
      newErrors.coverImage = 'Cover image is required (upload file or provide URL)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setUploading(true)

    try {
      const API_BASE_URL = getApiBaseUrl()
      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('source', formData.source.trim())
      formDataToSend.append('excerpt', formData.excerpt.trim())
      formDataToSend.append('content', formData.content.trim())
      formDataToSend.append('publishedAt', formData.publishedAt)
      formDataToSend.append('status', formData.status)

      // Handle cover image
      if (coverImageFile) {
        // File upload - will be handled by multer middleware
        formDataToSend.append('coverImage', coverImageFile)
      } else if (formData.coverImageUrl.trim()) {
        // External URL
        formDataToSend.append('coverImageUrl', formData.coverImageUrl.trim())
      } else if (deletedCoverImage) {
        // Mark for deletion
        formDataToSend.append('deletedCoverImage', 'true')
      }
      // If neither file nor URL, keep existing cover image (for edit mode)

      let response
      if (news && news._id) {
        // Update existing news
        response = await updateNews(news._id, formDataToSend)
      } else {
        // Create new news
        response = await createNews(formDataToSend)
      }

      if (response.success) {
        await onSubmit()
        onClose()
      } else {
        setErrors({ submit: response.message || 'Failed to save news' })
      }
    } catch (error: any) {
      console.error('News save error:', error)
      setErrors({ submit: error.message || 'An error occurred while saving news' })
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{news ? 'Edit News' : 'Create News'}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.submit && (
            <div className={styles.errorMessage}>{errors.submit}</div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? styles.inputError : ''}
              disabled={uploading}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="source">Source *</label>
            <input
              id="source"
              type="text"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="e.g., Dezeen, Vogue Living, Architectural Digest"
              className={errors.source ? styles.inputError : ''}
              disabled={uploading}
            />
            {errors.source && <span className={styles.errorText}>{errors.source}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="excerpt">Excerpt *</label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className={errors.excerpt ? styles.inputError : ''}
              disabled={uploading}
            />
            {errors.excerpt && <span className={styles.errorText}>{errors.excerpt}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              className={errors.content ? styles.inputError : ''}
              disabled={uploading}
            />
            {errors.content && <span className={styles.errorText}>{errors.content}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publishedAt">Published Date *</label>
            <input
              id="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
              disabled={uploading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Cover Image *</label>
            <div className={styles.imageUploadSection}>
              <div className={styles.uploadOption}>
                <label htmlFor="coverImageFile" className={styles.fileLabel}>
                  <Upload size={18} />
                  Upload File
                </label>
                <input
                  ref={fileInputRef}
                  id="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className={styles.fileInput}
                  disabled={uploading}
                />
              </div>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <div className={styles.urlOption}>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.coverImageUrl}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))
                    if (coverImageFile) {
                      handleRemoveCoverImage()
                    }
                  }}
                  className={styles.urlInput}
                  disabled={uploading}
                />
              </div>
            </div>

            {coverImagePreview && (
              <div className={styles.previewContainer}>
                <img src={coverImagePreview} alt="Cover preview" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  className={styles.removeButton}
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {errors.coverImage && <span className={styles.errorText}>{errors.coverImage}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              disabled={uploading}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {news && news.slug && (
            <div className={styles.formGroup}>
              <label>Slug (auto-generated)</label>
              <input
                type="text"
                value={news.slug}
                disabled
                className={styles.slugInput}
              />
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={uploading || loading}
            >
              {uploading ? 'Saving...' : news ? 'Update News' : 'Create News'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
