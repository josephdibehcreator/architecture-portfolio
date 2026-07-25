'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { type Blog, createBlog, updateBlog } from '@/services/admin/blogs'
import { getApiBaseUrl } from '@/services/api'
import styles from './BlogForm.module.css'

const TinyMCEBlogEditor = dynamic(() => import('./TinyMCEBlogEditor'), {
  ssr: false,
  loading: () => <div className={styles.editorLoading}>Loading editor…</div>,
})

interface BlogFormProps {
  blog?: Blog | null
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  loading?: boolean
}

export default function BlogForm({
  blog,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    coverImageUrl: '',
    author: '',
    status: 'draft' as 'draft' | 'published',
    coverImageCredit: ''
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

  // Initialize form when blog changes or modal opens/closes
  useEffect(() => {
    if (!blog || !blog._id) {
      // Reset form for new blog
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        coverImageUrl: '',
        author: '',
        status: 'draft',
        coverImageCredit: ''
      })
      setCoverImagePreview(null)
      setCoverImageFile(null)
      setDeletedCoverImage(false)
      setErrors({})
      return
    }

    // TypeScript: blog is guaranteed to be non-null here after the check
    const currentBlog = blog
    setFormData({
      title: currentBlog.title || '',
      excerpt: currentBlog.excerpt || '',
      content: currentBlog.content || '',
      category: currentBlog.category || '',
      coverImageUrl: currentBlog.coverImage?.url || '',
      author: currentBlog.author || '',
      status: currentBlog.status || 'draft',
      coverImageCredit: currentBlog.coverImageCredit || ''
    })
    setCoverImagePreview(currentBlog.coverImage?.url || null)
    setCoverImageFile(null)
    setDeletedCoverImage(false)
    setErrors({})
  }, [blog, isOpen])

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
    setDeletedCoverImage(blog && blog.coverImage ? true : false)
    
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
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    
    // Cover image validation
    if (!coverImageFile && !formData.coverImageUrl.trim() && !coverImagePreview && !blog?.coverImage) {
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
      formDataToSend.append('excerpt', formData.excerpt.trim())
      formDataToSend.append('content', formData.content.trim())
      formDataToSend.append('category', formData.category.trim())
      if (formData.author.trim()) {
        formDataToSend.append('author', formData.author.trim())
      }
      formDataToSend.append('status', formData.status)
      if (formData.coverImageCredit.trim()) {
        formDataToSend.append('coverImageCredit', formData.coverImageCredit.trim())
      }

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
      if (blog && blog._id) {
        // Update existing blog
        response = await updateBlog(blog._id, formDataToSend)
      } else {
        // Create new blog
        response = await createBlog(formDataToSend)
      }

      if (response.success) {
        await onSubmit()
        onClose()
      } else {
        setErrors({ submit: response.message || 'Failed to save blog' })
      }
    } catch (error: any) {
      console.error('Blog save error:', error)
      setErrors({ submit: error.message || 'An error occurred while saving blog' })
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{blog ? 'Edit Blog' : 'Create Blog'}</h2>
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
            <TinyMCEBlogEditor
              value={formData.content}
              onChange={(nextHtml) => setFormData(prev => ({ ...prev, content: nextHtml }))}
              disabled={uploading}
              hasError={Boolean(errors.content)}
            />
            {errors.content && <span className={styles.errorText}>{errors.content}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Design Insights, Materiality, History"
              className={errors.category ? styles.inputError : ''}
              disabled={uploading}
            />
            {errors.category && <span className={styles.errorText}>{errors.category}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Leave empty for default"
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
            <label htmlFor="coverImageCredit">Cover Image Credit</label>
            <input
              id="coverImageCredit"
              type="text"
              value={formData.coverImageCredit}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, coverImageCredit: e.target.value }))
              }
              placeholder="e.g. Photo by John Doe / Unsplash"
              disabled={uploading}
            />
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

          {blog && blog.slug && (
            <div className={styles.formGroup}>
              <label>Slug (auto-generated)</label>
              <input
                type="text"
                value={blog.slug}
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
              {uploading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
