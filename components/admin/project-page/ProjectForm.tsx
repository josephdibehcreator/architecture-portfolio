'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { type Project, type CreateProjectData } from '@/services/admin/projects'
import { getApiBaseUrl } from '@/services/api'
import styles from './ProjectForm.module.css'

interface ProjectFormProps {
  project?: Project | null
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void> // Changed - no data param, form handles API call
  loading?: boolean
}

export default function ProjectForm({
  project,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: ProjectFormProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    tag: 'Residential',
    year: null,
    category: '',
    description: '',
    coverImage: '',
    images: [],
    plans: [],
    info: {
      maitreDouverage: '',
      maitreDoeuvre: '',
      ingenieurs: '',
      surface: '',
      programme: '',
      budget: '',
      statut: '',
      fullDescription: ''
    },
    status: 'draft'
  })

  const [imageUrl, setImageUrl] = useState('')
  const [planUrl, setPlanUrl] = useState('')
  const [imagesList, setImagesList] = useState<string[]>([]) // URLs only (no blob previews)
  const [plansList, setPlansList] = useState<string[]>([]) // URLs only (no blob previews)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([]) // Blob URLs for preview
  const [planFiles, setPlanFiles] = useState<File[]>([])
  const [planPreviews, setPlanPreviews] = useState<string[]>([]) // Blob URLs for preview
  const [uploading, setUploading] = useState(false)
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [deletedPlans, setDeletedPlans] = useState<string[]>([])
  const [deletedCoverImage, setDeletedCoverImage] = useState(false)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
      planPreviews.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
      if (coverImagePreview && typeof coverImagePreview === 'string' && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview)
      }
    }
  }, [imagePreviews, planPreviews, coverImagePreview])

  useEffect(() => {
    if (!project || !project._id) {
      // Reset form for new project
      setFormData({
        title: '',
        tag: 'Residential',
        year: null,
        category: '',
        description: '',
        coverImage: '',
        images: [],
        plans: [],
        info: {
          maitreDouverage: '',
          maitreDoeuvre: '',
          ingenieurs: '',
          surface: '',
          programme: '',
          budget: '',
          statut: '',
          fullDescription: ''
        },
        status: 'draft'
      })
      setImagesList([])
      setPlansList([])
      setImagePreviews([])
      setPlanPreviews([])
      setCoverImagePreview(null)
      setImageUrl('')
      setPlanUrl('')
      setCoverImageFile(null)
      setImageFiles([])
      setPlanFiles([])
      setDeletedImages([])
      setDeletedPlans([])
      setDeletedCoverImage(false)
      return
    }

    // TypeScript: project is guaranteed to be non-null here after the check
    const currentProject = project
    setFormData({
      title: currentProject.title,
      tag: currentProject.tag,
      year: currentProject.year,
      category: currentProject.category || '',
      description: currentProject.description,
      coverImage: currentProject.coverImage || '',
      images: currentProject.images || [],
      plans: currentProject.plans || [],
      info: currentProject.info || {
        maitreDouverage: '',
        maitreDoeuvre: '',
        ingenieurs: '',
        surface: '',
        programme: '',
        budget: '',
        statut: '',
        fullDescription: ''
      },
      status: currentProject.status
    })
    setImagesList(currentProject.images || [])
    setImagePreviews([])
    // Only set plans for non-Residential projects
    setPlansList(currentProject.tag === 'Residential' ? [] : (currentProject.plans || []))
    setPlanPreviews([])
    setCoverImagePreview(currentProject.coverImage || null)
    setImageUrl('')
    setPlanUrl('')
    setCoverImageFile(null)
    setImageFiles([])
    setPlanFiles([])
    setDeletedImages([])
    setDeletedPlans([])
    setDeletedCoverImage(false)
  }, [project, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('info.')) {
      const infoField = name.replace('info.', '')
      setFormData(prev => ({
        ...prev,
        info: {
          ...prev.info!,
          [infoField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImagesList(prev => [...prev, imageUrl.trim()])
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = imagesList[index]
    // If it's a Cloudinary URL (contains 'cloudinary.com'), add to deleted list
    if (imageToRemove && imageToRemove.includes('cloudinary.com')) {
      setDeletedImages(prev => [...prev, imageToRemove])
    }
    setImagesList(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemovePlan = (index: number) => {
    const planToRemove = plansList[index]
    // If it's a Cloudinary URL, add to deleted list
    if (planToRemove && planToRemove.includes('cloudinary.com')) {
      setDeletedPlans(prev => [...prev, planToRemove])
    }
    setPlansList(prev => prev.filter((_, i) => i !== index))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImageFile(file)
      // If existing cover image is Cloudinary URL, mark for deletion
      if (formData.coverImage && formData.coverImage.includes('cloudinary.com')) {
        setDeletedCoverImage(true)
      }
      // Create preview URL (not stored in formData, just for display)
      const previewUrl = URL.createObjectURL(file)
      setCoverImagePreview(previewUrl)
    }
  }

  const handleRemoveCoverImage = () => {
    if (formData.coverImage && formData.coverImage.includes('cloudinary.com')) {
      setDeletedCoverImage(true)
    }
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    setCoverImageFile(null)
    setCoverImagePreview(null)
    setFormData(prev => ({ ...prev, coverImage: '' }))
  }

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setImageFiles(prev => [...prev, ...files])
      // Create preview URLs for display only
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
      // Reset input to allow selecting same files again
      e.target.value = ''
    }
  }

  const handleRemoveImageFile = (index: number) => {
    // Revoke blob URL
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index])
    }
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handlePlanFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.tag === 'Residential') return
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setPlanFiles(prev => [...prev, ...files])
      // Create preview URLs for display only
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPlanPreviews(prev => [...prev, ...newPreviews])
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemovePlanFile = (index: number) => {
    // Revoke blob URL
    if (planPreviews[index] && planPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(planPreviews[index])
    }
    setPlanFiles(prev => prev.filter((_, i) => i !== index))
    setPlanPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddPlan = () => {
    if (formData.tag === 'Residential') return // Residential projects cannot have plans
    if (planUrl.trim()) {
      setPlansList(prev => [...prev, planUrl.trim()])
      setPlanUrl('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('tag', formData.tag)
      if (formData.year) formDataToSend.append('year', formData.year)
      if (formData.category) formDataToSend.append('category', formData.category)
      if (formData.description) formDataToSend.append('description', formData.description)
      if (formData.status) formDataToSend.append('status', formData.status)
      
      // Add info fields (as individual fields with dot notation for FormData)
      if (formData.info) {
        if (formData.info.maitreDouverage) formDataToSend.append('info.maitreDouverage', formData.info.maitreDouverage)
        if (formData.info.maitreDoeuvre) formDataToSend.append('info.maitreDoeuvre', formData.info.maitreDoeuvre)
        if (formData.info.ingenieurs) formDataToSend.append('info.ingenieurs', formData.info.ingenieurs)
        if (formData.info.surface) formDataToSend.append('info.surface', formData.info.surface)
        if (formData.info.programme) formDataToSend.append('info.programme', formData.info.programme)
        if (formData.info.budget) formDataToSend.append('info.budget', formData.info.budget)
        if (formData.info.statut) formDataToSend.append('info.statut', formData.info.statut)
        if (formData.info.fullDescription) formDataToSend.append('info.fullDescription', formData.info.fullDescription)
      }
      
      // Add cover image (file takes priority, otherwise use URL)
      if (coverImageFile) {
        formDataToSend.append('coverImage', coverImageFile)
      } else if (formData.coverImage && !formData.coverImage.startsWith('blob:') && !deletedCoverImage) {
        // Only send URL if it's not a blob preview
        formDataToSend.append('coverImage', formData.coverImage)
      }
      
      // Add gallery images - files go to multer with field name 'images'
      // URLs go as separate field 'imagesUrls' as JSON array (always sent, even if empty)
      imageFiles.forEach(file => {
        formDataToSend.append('images', file)
      })
      
      // Add existing image URLs (not blob previews) as separate field
      const galleryImageUrls = imagesList
        .filter(url => url && !url.startsWith('blob:') && !url.includes('data:'))
        .map(url => url.trim())
        .filter(Boolean)
      formDataToSend.append('imagesUrls', JSON.stringify(galleryImageUrls))
      
      // Add plans - files go to multer with field name 'plans'
      // URLs go as separate field 'plansUrls' as JSON array (only for non-Residential, always sent even if empty)
      if (formData.tag !== 'Residential') {
        planFiles.forEach(file => {
          formDataToSend.append('plans', file)
        })
        
        const planUrls = plansList
          .filter(url => url && !url.startsWith('blob:') && !url.includes('data:'))
          .map(url => url.trim())
          .filter(Boolean)
        formDataToSend.append('plansUrls', JSON.stringify(planUrls))
      }
      
      // Add deleted images information (as JSON)
      if (deletedImages.length > 0) {
        formDataToSend.append('deletedImages', JSON.stringify(deletedImages))
      }
      if (deletedPlans.length > 0) {
        formDataToSend.append('deletedPlans', JSON.stringify(deletedPlans))
      }
      if (deletedCoverImage) {
        formDataToSend.append('deletedCoverImage', 'true')
      }
      
      // If editing, add ID to route
      const endpoint = project && project._id
        ? `/admin/projects/${project._id}`
        : '/admin/projects'
      const method = project && project._id ? 'PUT' : 'POST'
      
      // Get API base URL
      const API_BASE_URL = getApiBaseUrl()
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        body: formDataToSend,
        credentials: 'include' // Include cookies for admin auth
        // Don't set Content-Type header - browser will set it with boundary for FormData
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save project')
      }
      
      // Cleanup blob URLs
      imagePreviews.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
      planPreviews.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview)
      }
      
      // Call onSubmit callback to refresh the list in parent component
      await onSubmit()
      
      // Reset form state
      setCoverImageFile(null)
      setCoverImagePreview(null)
      setImageFiles([])
      setImagePreviews([])
      setPlanFiles([])
      setPlanPreviews([])
      setDeletedImages([])
      setDeletedPlans([])
      setDeletedCoverImage(false)
    } catch (error) {
      console.error('Error submitting project:', error)
      alert(error instanceof Error ? error.message : 'Failed to save project')
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Basic Info */}
            <div className={styles.section}>
              <h3>Basic Information</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="tag">Tag *</label>
                  <select
                    id="tag"
                    name="tag"
                    value={formData.tag}
                    onChange={(e) => {
                      handleChange(e)
                      // Clear plans if switching to Residential (Residential cannot have plans)
                      if (e.target.value === 'Residential') {
                        setPlansList([])
                      }
                    }}
                    required
                    disabled={loading}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="year">Year</label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleChange}
                    placeholder="2023"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  placeholder="Residential • Location"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div className={styles.section}>
              <h3>Images</h3>
              
              {/* Cover Image */}
              <div className={styles.formGroup}>
                <label htmlFor="coverImage">Cover Image</label>
                <div className={styles.imageUploadSection}>
                  <div className={styles.uploadOptions}>
                    <div className={styles.fileUploadOption}>
                      <label htmlFor="coverImageFile" className={styles.fileUploadLabel}>
                        <Upload size={18} />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          id="coverImageFile"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          disabled={loading || uploading}
                          className={styles.fileInput}
                        />
                      </label>
                    </div>
                    <span className={styles.orDivider}>OR</span>
                    <div className={styles.urlInputOption}>
                      <input
                        type="url"
                        id="coverImageUrl"
                        name="coverImage"
                        value={formData.coverImage && !formData.coverImage.startsWith('blob:') ? formData.coverImage : ''}
                        onChange={handleChange}
                        placeholder="Enter image URL..."
                        disabled={loading || uploading}
                        className={styles.urlInput}
                      />
                    </div>
                  </div>
                  {(coverImagePreview || (formData.coverImage && !coverImagePreview)) && (
                    <div className={styles.imagePreview}>
                      <img src={(coverImagePreview || formData.coverImage || '') as string} alt="Cover preview" />
                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        className={styles.removeImageButton}
                        disabled={loading || uploading}
                        title="Remove cover image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className={styles.formGroup}>
                <label>Gallery Images</label>
                <div className={styles.imageUploadSection}>
                  <div className={styles.uploadOptions}>
                    <div className={styles.fileUploadOption}>
                      <label htmlFor="imageFiles" className={styles.fileUploadLabel}>
                        <Upload size={18} />
                        <span>Upload Images (Multiple)</span>
                        <input
                          type="file"
                          id="imageFiles"
                          accept="image/*"
                          multiple
                          onChange={handleImageFilesChange}
                          disabled={loading || uploading}
                          className={styles.fileInput}
                        />
                      </label>
                    </div>
                    <span className={styles.orDivider}>OR</span>
                    <div className={styles.urlInputOption}>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL..."
                        disabled={loading || uploading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddImage()
                          }
                        }}
                        className={styles.urlInput}
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className={styles.addButton}
                        disabled={loading || uploading || !imageUrl.trim()}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                  {(imagesList.length > 0 || imagePreviews.length > 0) && (
                    <div className={styles.imagesGrid}>
                      {/* Show previews of uploaded files */}
                      {imagePreviews.map((preview, index) => (
                        <div key={`preview-${index}`} className={styles.imagePreviewItem}>
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageFile(index)}
                            className={styles.removeImageButton}
                            disabled={loading || uploading}
                            title="Remove uploaded image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {/* Show existing image URLs */}
                      {imagesList.map((url, index) => (
                        <div key={`url-${index}`} className={styles.imagePreviewItem}>
                          <img src={url} alt={`Gallery ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className={styles.removeImageButton}
                            disabled={loading || uploading}
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Plans (only for non-Residential) */}
              {formData.tag !== 'Residential' && (
                <div className={styles.formGroup}>
                  <label>Plans</label>
                  <div className={styles.imageUploadSection}>
                    <div className={styles.uploadOptions}>
                      <div className={styles.fileUploadOption}>
                        <label htmlFor="planFiles" className={styles.fileUploadLabel}>
                          <Upload size={18} />
                          <span>Upload Plans (Multiple)</span>
                          <input
                            type="file"
                            id="planFiles"
                            accept="image/*"
                            multiple
                            onChange={handlePlanFilesChange}
                            disabled={loading || uploading}
                            className={styles.fileInput}
                          />
                        </label>
                      </div>
                      <span className={styles.orDivider}>OR</span>
                      <div className={styles.urlInputOption}>
                        <input
                          type="url"
                          value={planUrl}
                          onChange={(e) => setPlanUrl(e.target.value)}
                          placeholder="Enter plan URL..."
                          disabled={loading || uploading}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddPlan()
                            }
                          }}
                          className={styles.urlInput}
                        />
                        <button
                          type="button"
                          onClick={handleAddPlan}
                          className={styles.addButton}
                          disabled={loading || uploading || !planUrl.trim()}
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                    {(plansList.length > 0 || planPreviews.length > 0) && (
                      <div className={styles.imagesGrid}>
                        {/* Show previews of uploaded plan files */}
                        {planPreviews.map((preview, index) => (
                          <div key={`plan-preview-${index}`} className={styles.imagePreviewItem}>
                            <img src={preview} alt={`Plan Preview ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => handleRemovePlanFile(index)}
                              className={styles.removeImageButton}
                              disabled={loading || uploading}
                              title="Remove uploaded plan"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {/* Show existing plan URLs */}
                        {plansList.map((url, index) => (
                          <div key={`plan-url-${index}`} className={styles.imagePreviewItem}>
                            <img src={url} alt={`Plan ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => handleRemovePlan(index)}
                              className={styles.removeImageButton}
                              disabled={loading || uploading}
                              title="Remove plan"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className={styles.section}>
              <h3>Project Details</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="info.maitreDouverage">Maître d'Ouvrage</label>
                <input
                  type="text"
                  id="info.maitreDouverage"
                  name="info.maitreDouverage"
                  value={formData.info?.maitreDouverage || ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="info.maitreDoeuvre">Maître d'Œuvre</label>
                <input
                  type="text"
                  id="info.maitreDoeuvre"
                  name="info.maitreDoeuvre"
                  value={formData.info?.maitreDoeuvre || ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="info.ingenieurs">Ingénieurs</label>
                <input
                  type="text"
                  id="info.ingenieurs"
                  name="info.ingenieurs"
                  value={formData.info?.ingenieurs || ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="info.surface">Surface</label>
                  <input
                    type="text"
                    id="info.surface"
                    name="info.surface"
                    value={formData.info?.surface || ''}
                    onChange={handleChange}
                    placeholder="85 m²"
                    disabled={loading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="info.budget">Budget</label>
                  <input
                    type="text"
                    id="info.budget"
                    name="info.budget"
                    value={formData.info?.budget || ''}
                    onChange={handleChange}
                    placeholder="420 000 € H.T"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="info.programme">Programme</label>
                <textarea
                  id="info.programme"
                  name="info.programme"
                  value={formData.info?.programme || ''}
                  onChange={handleChange}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="info.statut">Statut</label>
                <input
                  type="text"
                  id="info.statut"
                  name="info.statut"
                  value={formData.info?.statut || ''}
                  onChange={handleChange}
                  placeholder="Livré en 2023"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="info.fullDescription">Full Description</label>
                <textarea
                  id="info.fullDescription"
                  name="info.fullDescription"
                  value={formData.info?.fullDescription || ''}
                  onChange={handleChange}
                  rows={6}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || uploading || !formData.title.trim()}
            >
              {loading || uploading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
