'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ChevronRight, X } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useMotionValueEvent } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './CareerSection.module.css'
import { createApplication } from '@/services/careerApplication'
import { type Job } from '@/services/jobs'
import ThankYouMessage from '@/components/shared/ThankYouMessage'

// Mobile scroll speed in pixels per second (match ServicesList mobile speed)
const MOBILE_SCROLL_PX_PER_SEC = 80

interface CareerSectionProps {
  sectionNumber?: number
  initialJobs?: Job[]
}

export default function CareerSection({ sectionNumber, initialJobs = [] }: CareerSectionProps = {}) {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobs] = useState<Job[]>(initialJobs)
  const jobsLoading = false
  const [selectedJobData, setSelectedJobData] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    motivationLetter: '',
  })
  const [files, setFiles] = useState({
    cv: null as File | null,
    portfolio: null as File | null,
  })

  // Desktop vertical scroll animation refs (similar to ServicesList but vertical)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null) // Container ref for both desktop and mobile (for max-height)
  const animationRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const lastTimeRef = useRef<number>(0)
  const frameSkipRef = useRef<number>(0)
  const [isPaused, setIsPaused] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  // Mobile-specific animation state (Framer Motion, same style as ServicesList)
  const [isMobileClient, setIsMobileClient] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const mobileTrackRef = useRef<HTMLDivElement | null>(null)
  const [mobileTrackHeight, setMobileTrackHeight] = useState(0)
  const mobileY = useMotionValue(0)
  const [isMobileDragging, setIsMobileDragging] = useState(false)
  const mobileAnimationRef = useRef<number | null>(null)
  const mobileLastTimeRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Duplicate jobs for seamless vertical scroll (only when > 2 jobs)
  // Ensure jobs is always an array to prevent undefined errors
  const safeJobs: Job[] = Array.isArray(jobs) && jobs ? jobs : []
  const shouldAnimate = !jobsLoading && safeJobs.length > 2

  // Desktop: 3x for scrollTop-based infinite wrap
  const duplicatedJobsDesktop = React.useMemo(() => {
    if (!shouldAnimate || !Array.isArray(safeJobs) || safeJobs.length === 0) {
      return safeJobs
    }
    return [...safeJobs, ...safeJobs, ...safeJobs]
  }, [shouldAnimate, safeJobs])

  // Mobile: 2x for Framer Motion infinite loop (0% -> -50% style)
  const duplicatedJobsMobile = React.useMemo(() => {
    if (!shouldAnimate || !Array.isArray(safeJobs) || safeJobs.length === 0) {
      return safeJobs
    }
    return [...safeJobs, ...safeJobs]
  }, [shouldAnimate, safeJobs])

  // Detect mobile viewport on the client (match ServicesList logic)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobileClient(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Measure and set max-height when jobs are loaded and should animate (both desktop and mobile)
  useEffect(() => {
    if (!shouldAnimate || !containerRef.current) return

    // Wait for DOM to render the cards
    const timer = setTimeout(() => {
      // Measure from container (works for both desktop and mobile)
      const container = containerRef.current
      if (!container) return

      const firstCard = container.querySelector(`.${styles.jobCard}`) as HTMLElement | null
      if (!firstCard) return

      const cardRect = firstCard.getBoundingClientRect()
      const computed = window.getComputedStyle(container)
      const gapStr = computed.getPropertyValue('gap') || computed.getPropertyValue('row-gap') || '16px'
      const gap = parseFloat(gapStr) || 16

      const cardHeight = Math.round(cardRect.height)
      const cardPlusGap = cardHeight + gap
      const twoCardsHeight = cardPlusGap * 2

      // Set max-height on container (works for both desktop scroll and mobile clipping)
      if (twoCardsHeight > 0) {
        container.style.setProperty('--max-height', `${twoCardsHeight}px`)
        // Also update measured for desktop scroll calculations
        measured.current.twoCardsHeight = twoCardsHeight
        measured.current.cardPlusGap = cardPlusGap
        measured.current.singleSetHeight = cardPlusGap * safeJobs.length
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [shouldAnimate, safeJobs.length, jobsLoading])

  // Measured sizes (card height + gap) for vertical scroll
  const measured = useRef({ cardPlusGap: 0, singleSetHeight: 0, twoCardsHeight: 0 })

  // Measure card height + gap from DOM (for desktop scroll calculations)
  const measure = () => {
    const container = scrollRef.current || containerRef.current
    if (!container) return

    const firstCard = container.querySelector(`.${styles.jobCard}`) as HTMLElement | null
    if (!firstCard) return

    const cardRect = firstCard.getBoundingClientRect()
    const computed = window.getComputedStyle(container)
    const gapStr = computed.getPropertyValue('gap') || computed.getPropertyValue('row-gap') || '16px'
    const gap = parseFloat(gapStr) || 16

    const cardHeight = Math.round(cardRect.height)
    const cardPlusGap = cardHeight + gap
    const singleSetHeight = cardPlusGap * safeJobs.length
    // Height for exactly 2 cards (for max-height constraint)
    const twoCardsHeight = cardPlusGap * 2

    measured.current = { cardPlusGap, singleSetHeight, twoCardsHeight }

    // Set max-height to 2 cards height dynamically (for desktop)
    if (shouldAnimate && twoCardsHeight > 0 && scrollRef.current) {
      scrollRef.current.style.setProperty('--max-height', `${twoCardsHeight}px`)
    }
  }

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    if (!sectionRef.current || !shouldAnimate) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting
          setIsVisible(visible)

          if (visible && !initialized) {
            measure()
            const timer = setTimeout(() => {
              if (scrollRef.current && measured.current.singleSetHeight && measured.current.twoCardsHeight) {
                // Set max-height to 2 cards
                scrollRef.current.style.setProperty('--max-height', `${measured.current.twoCardsHeight}px`)
                scrollRef.current.style.scrollBehavior = 'auto'
                scrollRef.current.scrollTop = measured.current.singleSetHeight
                setTimeout(() => {
                  if (scrollRef.current) {
                    scrollRef.current.style.scrollBehavior = 'smooth'
                    setInitialized(true)
                    lastTimeRef.current = performance.now()
                  }
                }, 50)
              }
            }, 50)
            ;(observer as any)._timer = timer
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '100px',
      }
    )

    observer.observe(sectionRef.current)

    return () => {
      if ((observer as any)._timer) {
        clearTimeout((observer as any)._timer)
      }
      observer.disconnect()
    }
  }, [initialized, shouldAnimate])

  // Initialize scroll to middle set (fallback, desktop only)
  useEffect(() => {
    if (initialized || !shouldAnimate || isMobileClient) return

    const timer = window.setTimeout(() => {
      measure()
      if (!scrollRef.current) return

      const { cardPlusGap, singleSetHeight, twoCardsHeight } = measured.current
      if (!singleSetHeight || !cardPlusGap || !twoCardsHeight) return

      // Set max-height to 2 cards
      scrollRef.current.style.setProperty('--max-height', `${twoCardsHeight}px`)
      scrollRef.current.style.scrollBehavior = 'auto'
      scrollRef.current.scrollTop = singleSetHeight

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.style.scrollBehavior = 'smooth'
          setInitialized(true)
          lastTimeRef.current = performance.now()
        }
      }, 50)
    }, isVisible ? 50 : 100)

    const onResize = () => {
      window.clearTimeout((onResize as any)._t)
      ;(onResize as any)._t = window.setTimeout(() => {
        const prev = scrollRef.current ? scrollRef.current.scrollTop : 0
        measure()
        if (scrollRef.current) {
          const { singleSetHeight, twoCardsHeight } = measured.current
          if (singleSetHeight && twoCardsHeight) {
            // Update max-height on resize
            scrollRef.current.style.setProperty('--max-height', `${twoCardsHeight}px`)
            const offsetInSet = prev % singleSetHeight
            scrollRef.current.style.scrollBehavior = 'auto'
            scrollRef.current.scrollTop = singleSetHeight + offsetInSet
            setTimeout(() => {
              if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth'
            }, 30)
          }
        }
      }, 140)
    }

    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [initialized, isVisible, shouldAnimate])

  // Main vertical animation loop (infinite, desktop only)
  useEffect(() => {
    if (!initialized || !scrollRef.current || !shouldAnimate || isMobileClient) return

    const scrollSpeedPxPerFrame = 1.8
    frameSkipRef.current = 0
    const mobileFrameSkip = 1

    const step = (time: number) => {
      const container = scrollRef.current
      
      // Always continue the animation loop as long as container exists and shouldAnimate is true
      if (!container || !shouldAnimate) {
        return
      }

      // Pause scrolling when user is interacting, but keep the loop running
      if (pausedRef.current) {
        lastTimeRef.current = time
        animationRef.current = requestAnimationFrame(step)
        return
      }

      frameSkipRef.current++
      if (frameSkipRef.current % mobileFrameSkip !== 0) {
        animationRef.current = requestAnimationFrame(step)
        return
      }

      const delta = time - lastTimeRef.current
      lastTimeRef.current = time

      const clampedDelta = Math.min(delta, 50)
      const frameFactor = clampedDelta / 16.6667
      const move = scrollSpeedPxPerFrame * frameFactor

      const { cardPlusGap, singleSetHeight } = measured.current
      if (!singleSetHeight || !cardPlusGap) {
        animationRef.current = requestAnimationFrame(step)
        return
      }

      let current = container.scrollTop + move

      // Infinite wrap forward (vertical) - seamless infinite loop
      if (current >= singleSetHeight * 2) {
        container.style.scrollBehavior = 'auto'
        current = current - singleSetHeight
        container.scrollTop = current
        setTimeout(() => {
          if (container) container.style.scrollBehavior = 'smooth'
        }, 30)
      } else {
        container.scrollTop = current
      }

      // Always continue the infinite animation loop
      animationRef.current = requestAnimationFrame(step)
    }

    // Start the infinite animation loop
    animationRef.current = requestAnimationFrame(step)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [initialized, shouldAnimate, safeJobs.length, isMobileClient])

  // Dynamically add/remove will-change for performance and set max-height
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !shouldAnimate) return

    // Always keep max-height synced with 2-cards height when available
    if (measured.current.twoCardsHeight > 0) {
      container.style.setProperty('--max-height', `${measured.current.twoCardsHeight}px`)
    }

    // Only use scroll-position hint on desktop while auto-animating
    if (!isMobileClient && initialized) {
      container.style.willChange = 'scroll-position'
    } else {
      container.style.willChange = 'auto'
    }

    return () => {
      if (container) {
        container.style.willChange = 'auto'
      }
    }
  }, [initialized, shouldAnimate, isMobileClient])

  // Pause / resume helpers
  useEffect(() => {
    pausedRef.current = isPaused
  }, [isPaused])

  // Pointer/wheel handlers to pause while user interacts (desktop only)
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !initialized || !shouldAnimate || isMobileClient) return

    const onPointerDown = () => setIsPaused(true)
    const onPointerUp = () => setTimeout(() => setIsPaused(false), 150)
    const onTouchStart = () => setIsPaused(true)
    const onTouchEnd = () => setTimeout(() => setIsPaused(false), 150)
    const onWheel = () => {
      setIsPaused(true)
      clearTimeout((onWheel as any)._t)
      ;(onWheel as any)._t = setTimeout(() => setIsPaused(false), 300)
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    container.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('touchstart', onTouchStart as any)
      window.removeEventListener('touchend', onTouchEnd as any)
      container.removeEventListener('wheel', onWheel as any)
    }
  }, [initialized, shouldAnimate, isMobileClient])

  // Vertical: Infinite manual scroll wrap logic (same idea as ServicesList, desktop only)
  // When user manually scrolls (touchpad/wheel), normalize scrollTop to stay in the middle set.
  // This ensures manual scrolling is infinite, matching auto-scroll behavior.
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !initialized || !shouldAnimate || isMobileClient) return

    let isWrapping = false

    const onScroll = () => {
      if (isWrapping) return

      const { singleSetHeight } = measured.current
      if (!singleSetHeight) return

      const scrollTop = container.scrollTop

      // Wrap backward: scrolled too far up (above middle set)
      if (scrollTop < singleSetHeight) {
        isWrapping = true
        const prevBehavior = container.style.scrollBehavior
        container.style.scrollBehavior = 'auto'
        container.scrollTop = scrollTop + singleSetHeight
        requestAnimationFrame(() => {
          container.style.scrollBehavior = prevBehavior
          isWrapping = false
        })
        return
      }

      // Wrap forward: scrolled too far down (beyond middle set)
      if (scrollTop >= singleSetHeight * 2) {
        isWrapping = true
        const prevBehavior = container.style.scrollBehavior
        container.style.scrollBehavior = 'auto'
        container.scrollTop = scrollTop - singleSetHeight
        requestAnimationFrame(() => {
          container.style.scrollBehavior = prevBehavior
          isWrapping = false
        })
        return
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', onScroll as any)
    }
  }, [initialized, shouldAnimate, isMobileClient])

  const handleMouseEnter = () => {
    if (shouldAnimate) setIsPaused(true)
  }
  const handleMouseLeave = () => {
    if (shouldAnimate) setIsPaused(false)
  }

  // ----- Mobile Framer Motion auto-scroll and drag (same philosophy as ServicesList, but vertical) -----

  // Measure mobile track height (duplicated 2x; half is one full set)
  useEffect(() => {
    if (!isMobileClient || !shouldAnimate || !mobileTrackRef.current) return

    const measureTrack = () => {
      if (mobileTrackRef.current) {
        const fullHeight = mobileTrackRef.current.scrollHeight
        const halfHeight = fullHeight / 2
        setMobileTrackHeight(halfHeight)
      }
    }

    const timer = setTimeout(measureTrack, 100)
    window.addEventListener('resize', measureTrack)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measureTrack)
    }
  }, [isMobileClient, shouldAnimate, safeJobs.length])

  // Mobile: Continuous normalization observer - enforces infinite scroll invariant
  // This runs continuously to prevent motion value from escaping bounds during drag, inertia, or auto-scroll
  // Invariant: -mobileTrackHeight <= mobileY.get() <= 0
  useMotionValueEvent(mobileY, 'change', (latest) => {
    if (!isMobileClient || !shouldAnimate || mobileTrackHeight === 0) return

    let y = latest

    // Normalize position continuously for infinite effect
    // When dragging up (y > 0), wrap to negative
    if (y > 0) {
      y = y - mobileTrackHeight
      mobileY.set(y)
    }
    // When dragging down past the set (y < -mobileTrackHeight), wrap forward
    else if (y < -mobileTrackHeight) {
      y = y + mobileTrackHeight
      mobileY.set(y)
    }
  })

  // Mobile: RAF-based infinite auto-scroll using useMotionValue (respects prefersReducedMotion)
  // This allows seamless integration with drag (both use the same y value)
  useEffect(() => {
    if (!isMobileClient || !shouldAnimate || safeJobs.length === 0 || mobileTrackHeight === 0) {
      if (mobileAnimationRef.current) {
        cancelAnimationFrame(mobileAnimationRef.current)
        mobileAnimationRef.current = null
      }
      return
    }

    if (prefersReducedMotion) {
      if (mobileAnimationRef.current) {
        cancelAnimationFrame(mobileAnimationRef.current)
        mobileAnimationRef.current = null
      }
      return
    }

    mobileLastTimeRef.current = performance.now()

    const step = (time: number) => {
      // Skip animation while dragging
      if (isMobileDragging) {
        mobileLastTimeRef.current = time
        mobileAnimationRef.current = requestAnimationFrame(step)
        return
      }

      const delta = time - mobileLastTimeRef.current
      mobileLastTimeRef.current = time

      // Clamp delta to prevent large jumps
      const clampedDelta = Math.min(delta, 50)
      // Convert px/sec to px/frame
      const move = (MOBILE_SCROLL_PX_PER_SEC * clampedDelta) / 1000

      let currentY = mobileY.get() - move // Negative because we scroll up

      // Normalize position (wrap forward when reaching end)
      // The useMotionValueEvent observer will also normalize, but we do it here for immediate wrap
      if (currentY <= -mobileTrackHeight) {
        currentY = currentY + mobileTrackHeight
      }
      // Also normalize if somehow above 0 (shouldn't happen in auto-scroll, but safety check)
      if (currentY > 0) {
        currentY = currentY - mobileTrackHeight
      }

      mobileY.set(currentY)
      mobileAnimationRef.current = requestAnimationFrame(step)
    }

    mobileAnimationRef.current = requestAnimationFrame(step)

    return () => {
      if (mobileAnimationRef.current) {
        cancelAnimationFrame(mobileAnimationRef.current)
        mobileAnimationRef.current = null
      }
    }
  }, [isMobileClient, shouldAnimate, safeJobs.length, mobileTrackHeight, prefersReducedMotion, isMobileDragging, mobileY])

  // Mobile: drag handlers for infinite vertical scrolling (exact same pattern as ServicesList)
  const handleMobileDragStart = () => {
    if (!isMobileClient) return
    setIsMobileDragging(true)
  }

  const handleMobileDrag = () => {
    if (!isMobileClient || mobileTrackHeight === 0) return

    let currentY = mobileY.get()

    // Normalize position during drag for infinite effect (same logic as ServicesList, but vertical)
    // When dragging up (y > 0), wrap to negative
    if (currentY > 0) {
      mobileY.set(currentY - mobileTrackHeight)
    }
    // When dragging down past the set (y < -mobileTrackHeight), wrap forward
    else if (currentY < -mobileTrackHeight) {
      mobileY.set(currentY + mobileTrackHeight)
    }
  }

  const handleMobileDragEnd = () => {
    if (!isMobileClient) return
    setIsMobileDragging(false)
    // Auto-scroll resumes automatically via the RAF loop (same as ServicesList)
  }


  // Mobile: brief pause on tap, for consistent feel with ServicesList
  const handleMobileTap = () => {
    if (!isMobileClient) return
    setIsMobileDragging(true)
    setTimeout(() => setIsMobileDragging(false), 300)
  }

  const openModal = (jobTitle: string, jobId?: string) => {
    setSelectedJob(jobTitle)
    setSelectedJobId(jobId || null)
    // Find the job data for modal content (use safeJobs to prevent undefined errors)
    const jobData = safeJobs.find((j) => j._id === jobId)
    setSelectedJobData(jobData || null)
    setIsModalOpen(true)
    setError(null)
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      motivationLetter: '',
    })
    setFiles({
      cv: null,
      portfolio: null,
    })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedJob('')
    setSelectedJobId(null)
    setSelectedJobData(null)
    setError(null)
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      motivationLetter: '',
    })
    setFiles({
      cv: null,
      portfolio: null,
    })
  }

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      
      return () => {
        // Restore original overflow on cleanup
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isModalOpen])

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape)
      return () => {
        window.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isModalOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const allowedPdfDocxTypes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const isPdfOrDocxFile = (file: File): boolean => {
    const type = (file.type || '').toLowerCase()
    const name = (file.name || '').toLowerCase()
    const hasPdfExt = name.endsWith('.pdf')
    const hasDocxExt = name.endsWith('.docx')
    const typeAllowed = allowedPdfDocxTypes.includes(type)
    return typeAllowed || hasPdfExt || hasDocxExt
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]

      if (!isPdfOrDocxFile(file)) {
        setError(name === 'cv' ? t('career_form_cv_pdf') : t('career_form_portfolio_pdf'))
        return
      }

      setFiles(prev => ({
        ...prev,
        [name]: file,
      }))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (!files.cv) {
        setError(t('career_form_cv_required'))
        setSubmitting(false)
        return
      }

      // Prepare application data with careerId if available
      const applicationData: any = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        motivationLetter: formData.motivationLetter.trim(),
        jobTitle: selectedJob,
        cv: files.cv,
        portfolio: files.portfolio || undefined,
      }

      // Include careerId if we have it (backend supports this)
      if (selectedJobId) {
        applicationData.careerId = selectedJobId
      }

      const response = await createApplication(applicationData)

      if (response.success && response.data) {
        closeModal()
        setShowThankYou(true)
      } else {
        setError(response.message || t('career_form_error'))
      }
    } catch (err) {
      console.error('Error submitting application:', err)
      setError(t('career_form_error_generic'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section ref={sectionRef} className={styles.career} id="career">
        <div className="container-fluid">
          <div className={styles.content}>
            <div className={styles.left}>
              <span className={styles.label}>
                {sectionNumber !== undefined
                  ? `${sectionNumber.toString().padStart(2, '0')}. ${t('career_label')}`
                  : t('career_label')}
              </span>
              <h2 className={styles.title}>{t('career_title')}</h2>
              <p className={styles.description}>
                {t('career_description')}
              </p>
              <a href="mailto:recrutement@dibeh-architecture.com"
                 className={`${styles.emailLink} hover-trigger`}>
                 recrutement@dibeh-architecture.com <ArrowRight size={16} />
             </a>
            </div>
            <div
              className={`${styles.right} ${shouldAnimate ? styles.scrollContainer : ''} ${shouldAnimate && isMobileClient ? styles.mobileContainer : ''}`}
              ref={(el) => {
                containerRef.current = el
                if (shouldAnimate && !isMobileClient) {
                  scrollRef.current = el
                } else {
                  scrollRef.current = null
                }
              }}
              onMouseEnter={!isMobileClient ? handleMouseEnter : undefined}
              onMouseLeave={!isMobileClient ? handleMouseLeave : undefined}
            >
              {jobsLoading ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: 'var(--gray-500)'
                }}>
                  Loading...
                </div>
              ) : safeJobs.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: 'var(--gray-500)'
                }}>
                  No career openings available at this time.
                </div>
              ) : (
                <>
                  {/* Dynamic jobs: static if <= 2, animated if > 2 */}
                  {shouldAnimate && isMobileClient ? (
                    <motion.div
                    ref={mobileTrackRef}
                    className={styles.motionTrack}
                    style={{ y: mobileY }}
                    drag="y"
                    dragConstraints={false}
                    dragElastic={0.05}
                    dragMomentum={false}
                    onDragStart={handleMobileDragStart}
                    onDrag={handleMobileDrag}
                    onDragEnd={handleMobileDragEnd}
                    onTap={handleMobileTap}
                    >
                    {duplicatedJobsMobile.map((job, index) => {
                      const details = `${job.jobType} • ${job.duration || '2 Months'} • ${job.location} • ${job.workMode}`

                      return (
                        <div
                          key={`${index}-${job._id}`}
                          className={`${styles.jobCard} hover-trigger`}
                          onClick={() => openModal(job.title, job._id)}
                        >
                          <div className={styles.jobContent}>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.jobDetails}>{details}</p>
                          </div>
                          <ChevronRight size={20} className={styles.chevron} />
                        </div>
                      )
                  })}
                </motion.div>
                  ) : (
                    (shouldAnimate ? duplicatedJobsDesktop : safeJobs).map((job, index) => {
                      const details = `${job.jobType} • ${job.duration || '2 Months'} • ${job.location} • ${job.workMode}`

                      return (
                        <div
                          key={shouldAnimate ? `${index}-${job._id}` : job._id}
                          className={`${styles.jobCard} hover-trigger`}
                          onClick={() => openModal(job.title, job._id)}
                        >
                          <div className={styles.jobContent}>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.jobDetails}>{details}</p>
                          </div>
                          <ChevronRight size={20} className={styles.chevron} />
                        </div>
                      )
                    })
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Application Modal */}
      {isModalOpen && mounted && typeof window !== 'undefined' && document.body && createPortal((
        <div 
          className={styles.modalOverlay} 
          onClick={closeModal}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedJob || t('career_modal_apply')}</h3>
              <p className={styles.modalSubtitle}>
                {t('career_modal_subtitle')}
              </p>
              <div className={styles.modalDescription}>
                <h4 className={styles.descriptionTitle}>{t('career_modal_role_title')}</h4>
                <p className={styles.descriptionText}>
                  {selectedJobData?.fullDescription || t('career_modal_role_text')}
                </p>
                <h4 className={styles.descriptionTitle}>{t('career_modal_requirements_title')}</h4>
                <ul className={styles.requirementsList}>
                  {selectedJobData?.requirements && selectedJobData.requirements.length > 0
                    ? selectedJobData.requirements.map((req, idx) => <li key={idx}>{req}</li>)
                    : [
                        <li key="1">{t('career_modal_requirement_1')}</li>,
                        <li key="2">{t('career_modal_requirement_2')}</li>,
                        <li key="3">{t('career_modal_requirement_3')}</li>,
                        <li key="4">{t('career_modal_requirement_4')}</li>,
                      ]}
                </ul>
              </div>
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              {error && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#FEE2E2', 
                  color: '#DC2626', 
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('career_form_fullname')}</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className={styles.input}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('career_form_email')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className={styles.input}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.input}
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>{t('career_form_motivation')}</label>
                <textarea
                  name="motivationLetter"
                  rows={4}
                  required
                  className={styles.textarea}
                  placeholder={t('career_form_motivation_placeholder')}
                  value={formData.motivationLetter}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('career_form_cv')}</label>
                  <input
                    type="file"
                    name="cv"
                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                    required
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  {files.cv && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      {t('career_form_selected')} {files.cv.name}
                    </p>
                  )}
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('career_form_portfolio')}</label>
                  <input
                    type="file"
                    name="portfolio"
                    accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  {files.portfolio && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                      {t('career_form_selected')} {files.portfolio.name}
                    </p>
                  )}
                </div>
              </div>
              <button 
                type="submit" 
                className={`${styles.submitBtn} hover-trigger`}
                disabled={submitting}
              >
                {submitting ? t('career_form_submitting') : t('career_form_submit')}
              </button>
            </form>
          </div>
        </div>
      ), document.body)}
      
      {/* Thank You Message */}
      <ThankYouMessage
        message={t('career_thankyou')}
        show={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </>
  )
}
