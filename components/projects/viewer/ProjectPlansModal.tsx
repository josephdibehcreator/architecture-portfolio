'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import styles from './ProjectPlansModal.module.css'

interface ProjectPlansModalProps {
  title: string
  plans?: string[] | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectPlansModal({
  title,
  plans,
  isOpen,
  onClose,
}: ProjectPlansModalProps) {
  const safePlans = Array.isArray(plans) ? plans : []
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentPlanIndex(0)
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || safePlans.length === 0) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentPlanIndex((prev) => (prev - 1 + safePlans.length) % safePlans.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentPlanIndex((prev) => (prev + 1) % safePlans.length)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, safePlans.length, onClose])

  useEffect(() => {
    if (!isOpen) {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = ''
      }
      return
    }

    if (typeof document !== 'undefined' && document.body) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        if (document.body) {
          document.body.style.overflow = originalOverflow
        }
      }
    }
  }, [isOpen])

  if (!isOpen || safePlans.length === 0) return null

  const nextPlan = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentPlanIndex((prev) => (prev + 1) % safePlans.length)
  }

  const prevPlan = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentPlanIndex((prev) => (prev - 1 + safePlans.length) % safePlans.length)
  }

  return (
    <div className={styles.plansModalOverlay} onClick={onClose}>
      <div
        className={styles.plansModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.plansModalCorner} data-position="top-left"></div>
        <div className={styles.plansModalCorner} data-position="top-right"></div>
        <div className={styles.plansModalCorner} data-position="bottom-left"></div>
        <div className={styles.plansModalCorner} data-position="bottom-right"></div>

        <button
          className={styles.plansModalClose}
          onClick={onClose}
          aria-label="Close plans modal"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className={styles.plansModalHeader}>
          <h2 className={styles.plansModalTitle}>{title}</h2>
          <p className={styles.plansModalSubtitle}>Architectural Plans</p>
        </div>

        <div className={styles.plansGalleryContainer}>
          <div className={styles.plansImageWrapper}>
            {safePlans.map((plan, index) => {
              const isActive = index === currentPlanIndex
              return (
                <div
                  key={index}
                  className={`${styles.planImageContainer} ${
                    isActive ? styles.planImageActive : styles.planImageHidden
                  }`}
                >
                  <Image
                    src={plan}
                    alt={`${title} - Plan ${index + 1}`}
                    fill
                    className={styles.planImage}
                    sizes="(max-width: 768px) 90vw, 80vw"
                  />
                </div>
              )
            })}
          </div>

          {safePlans.length > 1 && (
            <>
              <button
                className={`${styles.planNavBtn} ${styles.planNavBtnPrev} hover-trigger`}
                onClick={prevPlan}
                aria-label="Previous plan"
              >
                <ChevronLeft size={24} strokeWidth={2} />
              </button>
              <button
                className={`${styles.planNavBtn} ${styles.planNavBtnNext} hover-trigger`}
                onClick={nextPlan}
                aria-label="Next plan"
              >
                <ChevronRight size={24} strokeWidth={2} />
              </button>
            </>
          )}

          {safePlans.length > 1 && (
            <div className={styles.planCounter}>
              <span className={styles.planCounterText}>
                {currentPlanIndex + 1} / {safePlans.length}
              </span>
            </div>
          )}
        </div>

        {safePlans.length > 1 && (
          <div className={styles.planThumbnails}>
            {safePlans.map((plan, index) => (
              <button
                key={index}
                className={`${styles.planThumbnail} ${
                  index === currentPlanIndex ? styles.planThumbnailActive : ''
                } hover-trigger`}
                onClick={() => setCurrentPlanIndex(index)}
                aria-label={`Go to plan ${index + 1}`}
              >
                <Image
                  src={plan}
                  alt={`Plan ${index + 1} thumbnail`}
                  fill
                  className={styles.planThumbnailImage}
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

