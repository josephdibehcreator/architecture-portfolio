'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { type Job, type CreateJobData } from '@/services/admin/adminjobs'
import styles from './AdminJobForm.module.css'

interface AdminJobFormProps {
  job?: Job | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateJobData, id?: string) => Promise<void>
  loading?: boolean
}

export default function AdminJobForm({ job, isOpen, onClose, onSubmit, loading = false }: AdminJobFormProps) {
  const [formState, setFormState] = useState<CreateJobData>({
    title: '',
    fullDescription: '',
    requirements: [],
    location: '',
    jobType: '',
    workMode: '',
    duration: '',
    applicationEmail: '',
    orderingIndex: 0,
    published: false,
  })
  const [newRequirement, setNewRequirement] = useState('')

  useEffect(() => {
    if (!isOpen) return

    if (job) {
      setFormState({
        title: job.title,
        fullDescription: job.fullDescription || '',
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        location: job.location || '',
        jobType: job.jobType || '',
        workMode: job.workMode || '',
        duration: job.duration || '',
        applicationEmail: job.applicationEmail || '',
        orderingIndex: job.orderingIndex ?? 0,
        published: job.published ?? job.status === 'published',
        translationKey: job.translationKey || '',
      })
    } else {
      setFormState({
        title: '',
        fullDescription: '',
        requirements: [],
        location: '',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        duration: '',
        applicationEmail: '',
        orderingIndex: 0,
        published: false,
        translationKey: '',
      })
    }
    setNewRequirement('')
  }, [job, isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormState((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value, 10),
      }))
      return
    }

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTogglePublished = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setFormState((prev) => ({
      ...prev,
      published: checked,
    }))
  }

  const handleAddRequirement = () => {
    const trimmed = newRequirement.trim()
    if (!trimmed) return
    setFormState((prev) => ({
      ...prev,
      requirements: [...(prev.requirements || []), trimmed],
    }))
    setNewRequirement('')
  }

  const handleRemoveRequirement = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateJobData = {
      ...formState,
      title: formState.title.trim(),
      fullDescription: formState.fullDescription.trim(),
      location: formState.location.trim(),
      jobType: formState.jobType.trim(),
      workMode: formState.workMode.trim(),
      duration: formState.duration?.trim() || undefined,
      applicationEmail: formState.applicationEmail.trim(),
      requirements: (formState.requirements || []).map((r) => r.trim()).filter(Boolean),
      orderingIndex: formState.orderingIndex ?? 0,
      published: !!formState.published,
      translationKey: formState.translationKey?.trim() || undefined,
    }

    await onSubmit(payload, job?._id)
  }

  const canSubmit =
    !loading &&
    formState.title.trim().length > 0 &&
    formState.fullDescription.trim().length > 0 &&
    formState.location.trim().length > 0 &&
    formState.jobType.trim().length > 0 &&
    formState.workMode.trim().length > 0 &&
    formState.applicationEmail.trim().length > 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{job ? 'Edit Career Opening' : 'Create Career Opening'}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div>
              <div className={styles.sectionTitle}>Position</div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="title">
                    Job title *
                  </label>
                </div>
                <input
                  id="title"
                  name="title"
                  className={styles.input}
                  value={formState.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Architecture Intern"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="duration">
                    Duration *
                  </label>
                  <span className={styles.labelHint}>Shown between job type and location (e.g. "2 Months")</span>
                </div>
                <input
                  id="duration"
                  name="duration"
                  className={styles.input}
                  value={formState.duration || ''}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="2 Months"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="fullDescription">
                    Full description *
                  </label>
                  <span className={styles.labelHint}>Markdown or rich text (plain text stored)</span>
                </div>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  className={styles.textarea}
                  value={formState.fullDescription}
                  onChange={handleChange}
                  disabled={loading}
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what you are looking for..."
                  required
                />
              </div>
            </div>
            <div>
              <div className={styles.sectionTitle}>Details</div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="location">
                    Location *
                  </label>
                </div>
                <input
                  id="location"
                  name="location"
                  className={styles.input}
                  value={formState.location}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Paris, France"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.inlineRow}>
                  <div>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="jobType">
                        Job type *
                      </label>
                    </div>
                    <select
                      id="jobType"
                      name="jobType"
                      className={styles.select}
                      value={formState.jobType}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <div className={styles.labelRow}>
                      <label className={styles.label} htmlFor="workMode">
                        Work mode *
                      </label>
                    </div>
                    <select
                      id="workMode"
                      name="workMode"
                      className={styles.select}
                      value={formState.workMode}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="applicationEmail">
                    Application email *
                  </label>
                  <span className={styles.labelHint}>Used as fallback if public form fails</span>
                </div>
                <input
                  id="applicationEmail"
                  name="applicationEmail"
                  type="email"
                  className={styles.input}
                  value={formState.applicationEmail}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="hr@example.com"
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="orderingIndex">
                    Ordering index
                  </label>
                  <span className={styles.labelHint}>Lower appears first</span>
                </div>
                <input
                  id="orderingIndex"
                  name="orderingIndex"
                  type="number"
                  className={styles.input}
                  value={formState.orderingIndex ?? 0}
                  onChange={handleChange}
                  disabled={loading}
                  min={0}
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="translationKey">
                    Translation key
                  </label>
                  <span className={styles.labelHint}>Optional link to language strings</span>
                </div>
                <input
                  id="translationKey"
                  name="translationKey"
                  className={styles.input}
                  value={formState.translationKey || ''}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="career_job_intern_interior"
                />
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Requirements</label>
                  <span className={styles.labelHint}>Shown in the application modal</span>
                </div>
                <div className={styles.inlineRow}>
                  <input
                    className={styles.input}
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    disabled={loading}
                    placeholder="Strong interest in architecture and interior design"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddRequirement()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleAddRequirement}
                    disabled={loading || !newRequirement.trim()}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {formState.requirements && formState.requirements.length > 0 && (
                  <div className={styles.requirementsList}>
                    {formState.requirements.map((req, index) => (
                      <div key={`${index}-${req}`} className={styles.requirementItem}>
                        <span className={styles.requirementText}>{req}</span>
                        <button
                          type="button"
                          className={styles.removeRequirementButton}
                          onClick={() => handleRemoveRequirement(index)}
                          disabled={loading}
                          title="Remove requirement"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.publishedToggle}>
                <input
                  id="published"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={!!formState.published}
                  onChange={handleTogglePublished}
                  disabled={loading}
                />
                <label className={styles.publishedLabel} htmlFor="published">
                  Published (visible on public careers section)
                </label>
              </div>
              <div className={styles.chipsRow}>
                <span className={styles.chip}>Draft / Published / Archived</span>
                <span className={styles.chip}>Ordering controls display order</span>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
              {loading ? 'Saving...' : job ? 'Update Career' : 'Create Career'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

