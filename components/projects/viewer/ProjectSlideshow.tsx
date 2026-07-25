'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './ProjectSlideshow.module.css'

type ProjectSlideshowRenderProps = {
  currentIndex: number
  hasImages: boolean
  next: () => void
  prev: () => void
  progress: number
}

interface ProjectSlideshowProps {
  images?: string[] | null
  title: string
  autoPlayIntervalMs?: number
  children: (slideshow: ProjectSlideshowRenderProps) => React.ReactNode
}

export default function ProjectSlideshow({
  images,
  title,
  autoPlayIntervalMs = 5000,
  children,
}: ProjectSlideshowProps) {
  const safeImages = Array.isArray(images) ? images : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const hasImages = safeImages.length > 0

  const next = () => {
    if (!hasImages) return
    setCurrentIndex((prev) => (prev + 1) % safeImages.length)
  }

  const prev = () => {
    if (!hasImages) return
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
  }

  useEffect(() => {
    if (!hasImages) {
      return
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeImages.length)
    }, autoPlayIntervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [hasImages, safeImages.length, autoPlayIntervalMs])

  const progress =
    hasImages && safeImages.length > 0 ? ((currentIndex + 1) / safeImages.length) * 100 : 0

  return (
    <section className={`${styles.projectViewer} ${styles.viewerOpen}`}>
      <div className={styles.viewerCorner} data-position="top-left"></div>
      <div className={styles.viewerCorner} data-position="top-right"></div>
      <div className={styles.viewerCorner} data-position="bottom-left"></div>
      <div className={styles.viewerCorner} data-position="bottom-right"></div>

      <div className={styles.viewerBackground}>
        {hasImages ? (
          <div className={styles.slideshowContainer}>
            {safeImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${index === currentIndex ? styles.slideActive : ''}`}
              >
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className={styles.slideImage}
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noImages}>
            <p>No images available</p>
          </div>
        )}
        <div className={styles.viewerOverlay1}></div>
        <div className={styles.viewerOverlay2}></div>
      </div>

      {children({
        currentIndex,
        hasImages,
        next,
        prev,
        progress,
      })}
    </section>
  )
}

