'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ThankYouMessage.module.css'

interface ThankYouMessageProps {
  message: string
  onClose: () => void
  show: boolean
}

export default function ThankYouMessage({ message, onClose, show }: ThankYouMessageProps) {
  const { t } = useLanguage()
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.messageBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <CheckCircle size={48} className={styles.icon} />
        </div>
        <h3 className={styles.title}>{t('thankyou_title')}</h3>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          {t('thankyou_close')}
        </button>
      </div>
    </div>
  )
}

