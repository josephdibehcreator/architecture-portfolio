'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import {
  getAdminHomepageStats,
  updateHomepageStats,
  type UpdateHomepageStatsPayload,
} from '@/services/admin/homepageStats'
import type { HomepageStatSuffix } from '@/services/homepageStats'
import styles from './HomepageStatsModal.module.css'

interface HomepageStatsModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialFormState: UpdateHomepageStatsPayload = {
  items: [
    { label: '', value: 0, suffix: '+' },
    { label: '', value: 0, suffix: '+' },
    { label: '', value: 0, suffix: '+' },
  ],
}

export default function HomepageStatsModal({ isOpen, onClose }: HomepageStatsModalProps) {
  const [formData, setFormData] = useState<UpdateHomepageStatsPayload>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        onClose()
      }
    }

    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, saving])

  useEffect(() => {
    if (!isOpen) return

    const loadStats = async () => {
      setLoading(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      try {
        const response = await getAdminHomepageStats()
        if (response.success && response.data) {
          setFormData({ items: response.data.items.slice(0, 3) })
        } else {
          setErrorMessage(response.message || 'Failed to load homepage stats')
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred while loading homepage stats')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [isOpen])

  const canSubmit = useMemo(() => {
    if (!Array.isArray(formData.items) || formData.items.length !== 3) return false

    return formData.items.every((item) => {
      if (!item.label.trim()) return false
      if (!Number.isFinite(Number(item.value)) || Number(item.value) < 0) return false
      return item.suffix === '' || item.suffix === '+' || item.suffix === '%'
    })
  }, [formData])

  const updateItem = (index: number, field: 'label' | 'value' | 'suffix', value: string) => {
    setFormData((prev) => {
      const items = [...prev.items]
      const current = items[index]
      if (!current) return prev

      if (field === 'label') {
        items[index] = { ...current, label: value }
      } else if (field === 'value') {
        const parsed = Number(value)
        items[index] = { ...current, value: Number.isFinite(parsed) ? parsed : 0 }
      } else {
        items[index] = { ...current, suffix: value as HomepageStatSuffix }
      }

      return {
        ...prev,
        items,
      }
    })
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    setSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const payload: UpdateHomepageStatsPayload = {
        items: formData.items.map((item) => ({
          label: item.label.trim(),
          value: Math.round(Number(item.value)),
          suffix: item.suffix,
        })),
      }

      const response = await updateHomepageStats(payload)
      if (response.success && response.data) {
        setFormData({ items: response.data.items.slice(0, 3) })
        setSuccessMessage('Homepage stats updated successfully')
      } else {
        setErrorMessage(response.message || 'Failed to update homepage stats')
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred while updating homepage stats')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const content = (
    <div className={styles.overlay} onClick={() => !saving && onClose()}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Homepage Stats</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close stats modal"
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading stats...</div>
        ) : (
          <form className={styles.form} onSubmit={handleSave}>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <div className={styles.sectionBlock}>
              <h3 className={styles.blockTitle}>Stats Items</h3>
              <div className={styles.itemsGrid}>
                {formData.items.map((item, index) => (
                  <div key={index} className={styles.itemCard}>
                    <p className={styles.itemTitle}>Stat {index + 1}</p>
                    <label className={styles.fieldLabel}>
                      Label
                      <input
                        type="text"
                        value={item.label}
                        onChange={(event) => updateItem(index, 'label', event.target.value)}
                        disabled={saving}
                      />
                    </label>

                    <label className={styles.fieldLabel}>
                      Value
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.value}
                        onChange={(event) => updateItem(index, 'value', event.target.value)}
                        disabled={saving}
                      />
                    </label>

                    <label className={styles.fieldLabel}>
                      Suffix
                      <select
                        value={item.suffix}
                        onChange={(event) => updateItem(index, 'suffix', event.target.value)}
                        disabled={saving}
                      >
                        <option value="">none</option>
                        <option value="+">+</option>
                        <option value="%">%</option>
                      </select>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={!canSubmit || saving}>
                {saving ? 'Saving...' : 'Save Stats'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )

  return typeof window !== 'undefined' && document.body ? createPortal(content, document.body) : null
}
