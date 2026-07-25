'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { getCurrentAdmin, updateAdminProfile } from '@/services/admin/admin'
import styles from './profile.module.css'



export default function AdminProfilePage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingAdmin, setLoadingAdmin] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getCurrentAdmin()
        if (res.success && res.data?.admin) {
          setAdmin(res.data.admin)
          setEmail(res.data.admin.email)
        } else {
          router.push('/admin/login')
        }
      } catch (err) {
        setError('Failed to load admin info')
        router.push('/admin/login')
      } finally {
        setLoadingAdmin(false)
      }
    }
    load()
  }, [router])

  const validate = () => {
    if (!currentPassword) return 'Current password is required'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Invalid email format'
    
    if (newPassword) {
      if (newPassword.length < 8) return 'New password must be at least 8 characters'
      if (newPassword !== confirmPassword) return 'New passwords do not match'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const res = await updateAdminProfile({
        email,
        currentPassword,
        newPassword: newPassword || undefined
      })
      
      if (!res.success) {
        setError(res.message || 'Update failed')
      } else {
        setMessage('Profile updated successfully')
        setAdmin({ email })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingAdmin) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Profile</h1>
        <p className={styles.subtitle}>Update your email and password</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            aria-required="true"
            aria-invalid={error?.includes('email') ? 'true' : 'false'}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currentPassword" className={styles.label}>
            Current Password <span className={styles.required}>*</span>
          </label>
          <div className={styles.passwordInput}>
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={styles.input}
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className={styles.passwordToggle}
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.passwordInput}>
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              aria-invalid={error?.includes('password') ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className={styles.passwordToggle}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {newPassword && (
            <p className={styles.helpText}>
              Must be at least 8 characters long
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm New Password
          </label>
          <div className={styles.passwordInput}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              aria-invalid={error?.includes('match') ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.passwordToggle}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {newPassword && confirmPassword && newPassword === confirmPassword && (
            <p className={styles.successText}>
              <CheckCircle2 size={14} /> Passwords match
            </p>
          )}
        </div>

        {error && (
          <div className={styles.alert} role="alert" aria-live="polite">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert" aria-live="polite">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={loading || !currentPassword}
            className={styles.submitButton}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
