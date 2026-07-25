'use client'

import { useEffect, useState, type MouseEventHandler } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react'
import styles from './ProjectGalleryModal.module.css'

interface ProjectGalleryModalProps {
  isOpen: boolean
  images?: string[] | null
  title?: string
  initialIndex?: number
  onClose: () => void
}

export default function ProjectGalleryModal({
  isOpen,
  images,
  title,
  initialIndex,
  onClose,
}: ProjectGalleryModalProps) {
  const safeImages = Array.isArray(images) ? images : []
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0)
      return
    }

    if (typeof initialIndex === 'number' && initialIndex >= 0 && initialIndex < safeImages.length) {
      setCurrentIndex(initialIndex)
    } else {
      setCurrentIndex(0)
    }
  }, [isOpen, initialIndex, safeImages.length])

  useEffect(() => {
    if (!isOpen || safeImages.length === 0) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || safeImages.length === 0) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev + 1) % safeImages.length)
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
  }, [isOpen, safeImages.length, onClose])

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

  if (!isOpen || safeImages.length === 0) return null

  const currentImage = safeImages[currentIndex]
  const total = safeImages.length

  const handleOverlayClick = () => {
    onClose()
  }

  const handleContentClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

  return (
    <div className={styles.galleryOverlay} onClick={handleOverlayClick} aria-modal="true" role="dialog">
      <div className={styles.galleryContent} onClick={handleContentClick}>
        <div className={styles.modalCorner} data-position="top-left"></div>
        <div className={styles.modalCorner} data-position="top-right"></div>
        <div className={styles.modalCorner} data-position="bottom-left"></div>
        <div className={styles.modalCorner} data-position="bottom-right"></div>

        <button
          className={styles.galleryClose}
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <header className={styles.galleryHeader}>
          {title && <h2 className={styles.galleryTitle}>{title}</h2>}
          <div className={styles.galleryMeta}>
            <span className={styles.galleryCounter}>
              {currentIndex + 1} / {total}
            </span>
          </div>
        </header>

        <div className={styles.galleryMain}>
          <button
            className={`${styles.galleryNavBtn} ${styles.galleryNavPrev} hover-trigger`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevImage()
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          <div className={styles.imageWrapper}>
            <Image
              key={currentImage}
              src={currentImage}
              alt={title ? `${title} - Image ${currentIndex + 1}` : `Image ${currentIndex + 1}`}
              fill
              className={styles.galleryImage}
              sizes="100vw"
              priority
            />
          </div>

          <button
            className={`${styles.galleryNavBtn} ${styles.galleryNavNext} hover-trigger`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextImage()
            }}
            aria-label="Next image"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </div>

        <footer className={styles.galleryFooter}>
          <div className={styles.galleryFooterLeft}>
          <LayoutGrid size={18} strokeWidth={2} />
            <span className={styles.galleryFooterLabel}>Full-screen gallery</span>
          </div>
          <p className={styles.rotateHint}>Tip: rotate your device for a better viewing experience.</p>
        </footer>
      </div>
    </div>
  )
}

