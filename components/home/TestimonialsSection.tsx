'use client'

import { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, ArrowLeft, ArrowRight, Share2 } from 'lucide-react'
import { animate, motion, useReducedMotion, useMotionValue } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './TestimonialsSection.module.css'
import { createTestimonial, type Testimonial } from '@/services/testimonials'
import ThankYouMessage from '@/components/shared/ThankYouMessage'

// SHARED MOBILE SCROLL SPEED CONSTANT (pixels per second)
// This ensures both Testimonials and Services sections scroll at the EXACT same visual speed
// Desktop uses different logic (scrollLeft + RAF) and is NOT affected by this constant
const MOBILE_SCROLL_PX_PER_SEC = 80
const DESKTOP_SCROLL_PX_PER_SEC = 80
const TESTIMONIAL_CARD_WIDTH_MOBILE = 300
const TESTIMONIAL_CARD_WIDTH_DESKTOP = 380
const TESTIMONIAL_CARD_GAP = 24
const TEXT_TRUNCATE_LIMIT = 150

interface TestimonialsSectionProps {
  sectionNumber?: number
  initialTestimonials: Testimonial[]
}

// Helper function to get initials from full name
function getInitials(fullName: string): string {
  const names = fullName.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return fullName.substring(0, 2).toUpperCase()
}

export default function TestimonialsSection({
  sectionNumber,
  initialTestimonials,
}: TestimonialsSectionProps) {
  const { t } = useLanguage()
  const [testimonials] = useState<Testimonial[]>(initialTestimonials)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    projectType: '',
    review: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const [showShareCopied, setShowShareCopied] = useState(false)
  const didAutoOpenRef = useRef(false)
  
  // Mobile-specific animation state
  const [isMobileClient, setIsMobileClient] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  const mobileViewportRef = useRef<HTMLDivElement | null>(null)
  const mobileTrackRef = useRef<HTMLDivElement | null>(null)
  const mobileIsTouchingRef = useRef(false)
  const mobileX = useMotionValue(0)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const desktopTrackRef = useRef<HTMLDivElement | null>(null)
  const desktopX = useMotionValue(0)
  const desktopAnimationRef = useRef<number | null>(null)
  const desktopLastTimeRef = useRef<number>(0)
  const desktopPauseTimeoutRef = useRef<number | null>(null)
  const desktopArrowAnimStopRef = useRef<null | (() => void)>(null)
  const [isPaused, setIsPaused] = useState(false)
  const desktopMeasured = useRef({ cardPlusGap: 0, singleSetWidth: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)


  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const openModal = useCallback(() => {
    setShowModal(true)
    setError(null)
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      projectType: '',
      review: '',
    })
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setError(null)
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      projectType: '',
      review: '',
    })
  }, [])

  // Auto-open modal via deep link: ?openReviewModal=1#testimonials
  useEffect(() => {
    if (!mounted) return
    if (didAutoOpenRef.current) return
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    const shouldOpen = url.searchParams.get('openReviewModal') === '1'
    if (!shouldOpen) return

    didAutoOpenRef.current = true

    window.setTimeout(() => {
      const el = document.getElementById('testimonials')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      openModal()

      url.searchParams.delete('openReviewModal')
      window.history.replaceState({}, '', url.toString())
    }, 250)
  }, [mounted, openModal])

  // Lightweight "Link copied!" feedback
  useEffect(() => {
    if (!showShareCopied) return
    const timer = window.setTimeout(() => setShowShareCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [showShareCopied])

  // Detect mobile viewport on the client to switch between desktop (scrollLeft) and mobile (Framer Motion) logic
  useLayoutEffect(() => {
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

  useEffect(() => {
    if (!isMobileClient) return
    if (prefersReducedMotion) return
    if (testimonials.length === 0) return

    const singleCount = testimonials.length + 1
    const singleSetWidth =
      TESTIMONIAL_CARD_WIDTH_MOBILE * singleCount + TESTIMONIAL_CARD_GAP * (singleCount - 1)
    if (!singleSetWidth) return

    let rafId: number
    let lastTime = performance.now()

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 50)
      lastTime = time

      if (!mobileIsTouchingRef.current) {
        let x = mobileX.get() - (MOBILE_SCROLL_PX_PER_SEC * delta) / 1000
        if (x <= -singleSetWidth) x += singleSetWidth
        else if (x > 0) x -= singleSetWidth
        mobileX.set(x)
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [isMobileClient, prefersReducedMotion, testimonials.length, mobileX])

  useEffect(() => {
    if (!isMobileClient) return
    const viewport = mobileViewportRef.current
    if (!viewport) return

    const SWIPE_THRESHOLD = 5
    const MOMENTUM_DECAY = 0.95
    const MIN_VELOCITY = 0.5

    const singleCount = testimonials.length + 1
    const singleSetWidth =
      TESTIMONIAL_CARD_WIDTH_MOBILE * singleCount + TESTIMONIAL_CARD_GAP * (singleCount - 1)

    let touchStartX = 0, touchStartY = 0, lastTouchX = 0, lastTouchTime = 0
    let velocity = 0, isSwiping = false, startX = 0, momentumRafId = 0

    const normalize = (x: number) => {
      if (x <= -singleSetWidth) return x + singleSetWidth
      if (x > 0) return x - singleSetWidth
      return x
    }

    const stopMomentum = () => { if (momentumRafId) { cancelAnimationFrame(momentumRafId); momentumRafId = 0 } }

    const startMomentum = (initialVelocity: number) => {
      stopMomentum()
      let v = initialVelocity
      const tick = () => {
        if (Math.abs(v) < MIN_VELOCITY) { momentumRafId = 0; return }
        mobileX.set(normalize(mobileX.get() + v))
        v *= MOMENTUM_DECAY
        momentumRafId = requestAnimationFrame(tick)
      }
      momentumRafId = requestAnimationFrame(tick)
    }

    const onTouchStart = (e: TouchEvent) => {
      stopMomentum()
      const t = e.touches[0]
      touchStartX = t.clientX; touchStartY = t.clientY
      lastTouchX = t.clientX; lastTouchTime = performance.now()
      velocity = 0; isSwiping = false; startX = mobileX.get()
      mobileIsTouchingRef.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      const dx = t.clientX - touchStartX
      const dy = t.clientY - touchStartY
      if (!isSwiping) {
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return
        if (Math.abs(dy) > Math.abs(dx)) { mobileIsTouchingRef.current = false; return }
        isSwiping = true
      }
      e.preventDefault()
      const now = performance.now()
      const dt = now - lastTouchTime
      if (dt > 0) velocity = (t.clientX - lastTouchX) / dt
      lastTouchX = t.clientX; lastTouchTime = now
      mobileX.set(normalize(startX + dx))
    }

    const onTouchEnd = () => {
      mobileIsTouchingRef.current = false
      if (!isSwiping) return
      isSwiping = false
      const fv = velocity * 16
      if (Math.abs(fv) > MIN_VELOCITY) startMomentum(fv)
    }

    viewport.addEventListener('touchstart', onTouchStart, { passive: true })
    viewport.addEventListener('touchmove', onTouchMove, { passive: false })
    viewport.addEventListener('touchend', onTouchEnd, { passive: true })
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      stopMomentum()
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMove)
      viewport.removeEventListener('touchend', onTouchEnd)
      viewport.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [isMobileClient, testimonials.length, mobileX])

  const measureDesktop = () => {
    const viewport = scrollRef.current
    const track = desktopTrackRef.current
    if (!viewport || !track) return

    const firstCard = track.querySelector(`.${styles.testimonialCard}`) as HTMLElement | null
    if (!firstCard) return

    const cardRect = firstCard.getBoundingClientRect()
    const computed = window.getComputedStyle(track)
    const gapStr = computed.getPropertyValue('gap') || computed.getPropertyValue('column-gap') || '24px'
    const gap = parseFloat(gapStr) || 24

    const cardWidth = Math.round(cardRect.width) || TESTIMONIAL_CARD_WIDTH_DESKTOP
    const cardPlusGap = cardWidth + gap
    const singleCount = testimonials.length + 1
    const singleSetWidth = cardPlusGap * singleCount

    desktopMeasured.current = { cardPlusGap, singleSetWidth }
  }

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (isMobile) return
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting
          setIsVisible(visible)
        })
      },
      {
        threshold: 0.05,
        rootMargin: '100px'
      }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobileClient) return
    if (!scrollRef.current) return

    const applyInitialPosition = () => {
      measureDesktop()
      const { singleSetWidth } = desktopMeasured.current
      if (!singleSetWidth) return

      desktopX.set(-singleSetWidth)
    }

    const t = window.setTimeout(applyInitialPosition, 50)

    const onResize = () => {
      window.clearTimeout((onResize as any)._t)
      ;(onResize as any)._t = window.setTimeout(() => {
        const prevW = desktopMeasured.current.singleSetWidth
        const prevX = desktopX.get()

        measureDesktop()
        const nextW = desktopMeasured.current.singleSetWidth
        if (!nextW) return

        if (!prevW) {
          desktopX.set(-nextW)
          return
        }

        const offsetInSet = ((-prevX) % prevW + prevW) % prevW
        desktopX.set(-nextW - Math.min(offsetInSet, nextW))
      }, 140)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [isMobileClient, desktopX, testimonials.length])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobileClient) return
    if (!isVisible) return

    if (prefersReducedMotion) {
      if (desktopAnimationRef.current) {
        cancelAnimationFrame(desktopAnimationRef.current)
        desktopAnimationRef.current = null
      }
      return
    }

    const step = (time: number) => {
      if (isPaused) {
        desktopLastTimeRef.current = time
        desktopAnimationRef.current = requestAnimationFrame(step)
        return
      }

      const { singleSetWidth } = desktopMeasured.current
      if (!singleSetWidth) {
        desktopLastTimeRef.current = time
        desktopAnimationRef.current = requestAnimationFrame(step)
        return
      }

      const delta = time - desktopLastTimeRef.current
      desktopLastTimeRef.current = time

      const clampedDelta = Math.min(delta, 50)
      const move = (DESKTOP_SCROLL_PX_PER_SEC * clampedDelta) / 1000

      let x = desktopX.get() - move

      if (x <= -singleSetWidth * 2) {
        x = x + singleSetWidth
      } else if (x > -singleSetWidth) {
        x = x - singleSetWidth
      }

      desktopX.set(x)
      desktopAnimationRef.current = requestAnimationFrame(step)
    }

    desktopLastTimeRef.current = performance.now()
    desktopAnimationRef.current = requestAnimationFrame(step)

    return () => {
      if (desktopAnimationRef.current) {
        cancelAnimationFrame(desktopAnimationRef.current)
        desktopAnimationRef.current = null
      }
    }
  }, [isMobileClient, isVisible, prefersReducedMotion, isPaused, desktopX])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobileClient) return

    const viewport = scrollRef.current
    if (!viewport) return

    const pauseBriefly = (ms: number) => {
      setIsPaused(true)
      if (desktopPauseTimeoutRef.current) window.clearTimeout(desktopPauseTimeoutRef.current)
      desktopPauseTimeoutRef.current = window.setTimeout(() => setIsPaused(false), ms)
    }

    const onPointerDown = () => setIsPaused(true)
    const onPointerUp = () => pauseBriefly(150)
    const onWheel = () => pauseBriefly(300)

    viewport.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      viewport.removeEventListener('wheel', onWheel as any)
      if (desktopPauseTimeoutRef.current) {
        window.clearTimeout(desktopPauseTimeoutRef.current)
        desktopPauseTimeoutRef.current = null
      }
    }
  }, [isMobileClient])

  const scrollMobileByCard = (direction: 'left' | 'right') => {
    if (!isMobileClient) return
    const singleCount = testimonials.length + 1
    const singleSetWidth = TESTIMONIAL_CARD_WIDTH_MOBILE * singleCount + TESTIMONIAL_CARD_GAP * (singleCount - 1)
    const step = TESTIMONIAL_CARD_WIDTH_MOBILE + TESTIMONIAL_CARD_GAP
    let x = mobileX.get()
    x = direction === 'left' ? x + step : x - step
    if (x <= -singleSetWidth) x += singleSetWidth
    else if (x > 0) x -= singleSetWidth
    mobileX.set(x)
  }

  const scrollDesktopByCard = (direction: 'left' | 'right') => {
    if (isMobileClient) return
    if (prefersReducedMotion) {
      const { cardPlusGap, singleSetWidth } = desktopMeasured.current
      if (!cardPlusGap || !singleSetWidth) return

      const currentX = desktopX.get()
      let nextX = direction === 'left' ? currentX + cardPlusGap : currentX - cardPlusGap

      if (nextX <= -singleSetWidth * 2) nextX = nextX + singleSetWidth
      else if (nextX > -singleSetWidth) nextX = nextX - singleSetWidth

      desktopX.set(nextX)
      return
    }

    measureDesktop()
    const { cardPlusGap, singleSetWidth } = desktopMeasured.current
    if (!cardPlusGap || !singleSetWidth) return

    setIsPaused(true)

    if (desktopArrowAnimStopRef.current) {
      desktopArrowAnimStopRef.current()
      desktopArrowAnimStopRef.current = null
    }

    const currentX = desktopX.get()
    let targetX = direction === 'left' ? currentX + cardPlusGap : currentX - cardPlusGap

    if (targetX <= -singleSetWidth * 2) targetX = targetX + singleSetWidth
    else if (targetX > -singleSetWidth) targetX = targetX - singleSetWidth

    const controls = animate(desktopX, targetX, { duration: 0.45, ease: [0.22, 1, 0.36, 1] })
    desktopArrowAnimStopRef.current = controls.stop

    if (desktopPauseTimeoutRef.current) window.clearTimeout(desktopPauseTimeoutRef.current)
    desktopPauseTimeoutRef.current = window.setTimeout(() => setIsPaused(false), 650)
  }

  // Unified button handler for both desktop and mobile
  const handleScrollByCard = (direction: 'left' | 'right') => {
    if (isMobileClient) {
      scrollMobileByCard(direction)
    } else {
      scrollDesktopByCard(direction)
    }
  }
  
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return

    const anyModalOpen = showModal || selectedTestimonial !== null
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [showModal, selectedTestimonial])

  // Close view modal on ESC
  useEffect(() => {
    if (!selectedTestimonial) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTestimonial(null)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedTestimonial])

  const copyTextToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
    } catch {
      // Fall through to legacy copy method
    }

    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }

  const handleShareReviewLink = async () => {
    if (typeof window === 'undefined') return

    const url = new URL('https://www.dibeh-architecture.com/')
    url.searchParams.set('openReviewModal', '1')
    url.hash = 'testimonials'
    const shareLink = url.toString()

    const copied = await copyTextToClipboard(shareLink)
    if (copied) {
      setShowShareCopied(true)
      return
    }

    // Fallback: allow manual copy
    window.prompt('Copy this link:', shareLink)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const response = await createTestimonial({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        projectType: formData.projectType.trim() || undefined,
        review: formData.review.trim(),
      })

      if (response.success && response.data) {
        closeModal()
        setShowThankYou(true)
      } else {
        setError(response.message || t('testimonials_error_submit'))
      }
    } catch (err) {
      console.error('Error submitting testimonial:', err)
      setError(t('testimonials_error_generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const modalContent = showModal ? (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={closeModal} aria-label="Close modal">
          <X size={24} strokeWidth={1.5} />
        </button>

        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{t('testimonials_modal_title')}</h3>
          <p className={styles.modalDescription}>{t('testimonials_modal_description')}</p>
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
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('testimonials_form_fullname')}</label>
            <input
              type="text"
              name="fullName"
              required
              className={styles.formInput}
              placeholder={t('testimonials_form_placeholder_name')}
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('testimonials_form_email')}</label>
            <input
              type="email"
              name="email"
              required
              className={styles.formInput}
              placeholder={t('testimonials_form_placeholder_email')}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('testimonials_form_phone')}</label>
            <input
              type="tel"
              name="phoneNumber"
              className={styles.formInput}
              placeholder={t('testimonials_form_placeholder_phone')}
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('testimonials_form_project_type')}</label>
            <input
              type="text"
              name="projectType"
              className={styles.formInput}
              placeholder={t('testimonials_form_placeholder_project')}
              value={formData.projectType}
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('testimonials_form_review')}</label>
            <textarea
              name="review"
              rows={4}
              required
              className={styles.formTextarea}
              placeholder={t('testimonials_form_placeholder_review')}
              value={formData.review}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className={`${styles.submitButton} hover-trigger`}
            disabled={submitting}
          >
            {submitting ? t('testimonials_btn_submitting') : t('testimonials_btn_submit')}
          </button>
        </form>
      </div>
    </div>
  ) : null

  const viewModalContent = selectedTestimonial ? (
    <div className={styles.modalOverlay} onClick={() => setSelectedTestimonial(null)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={() => setSelectedTestimonial(null)} aria-label="Close">
          <X size={24} strokeWidth={1.5} />
        </button>
        <div className={styles.viewModalBody}>
          <p className={styles.viewModalQuote}>{selectedTestimonial.review}</p>
          <div className={styles.viewModalDivider} />
          <div className={styles.author}>
            <div className={styles.avatar}>{getInitials(selectedTestimonial.fullName)}</div>
            <div>
              <div className={styles.name}>{selectedTestimonial.fullName}</div>
              <div className={styles.project}>{selectedTestimonial.projectType || t('testimonials_client_fallback')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const createSingleSet = () => {
    const addButtonItem = { _id: 'add-button', isAddButton: true } as const

    if (testimonials.length === 0) return [addButtonItem]

    return [...testimonials, addButtonItem]
  }

  const mobileItems = useMemo(() => {
    const s = createSingleSet()
    // Don't duplicate when there are no real testimonials — just show the single add button
    if (testimonials.length === 0) return s
    return [...s, ...s]
  }, [testimonials])

  const desktopItems = useMemo(() => {
    const s = createSingleSet()
    // Don't duplicate when there are no real testimonials — just show the single add button
    if (testimonials.length === 0) return s
    return [...s, ...s, ...s]
  }, [testimonials])

  const renderTestimonialItem = (item: any, index: number) => {
    if (item.isAddButton) {
      return (
        <div key={`add-${index}`} className={`${styles.testimonialCard} hover-trigger`}>
          <button 
            className={`${styles.addButton} hover-trigger`} 
            onClick={() => {
              openModal()
            }}
          >
            <div className={styles.addIcon}>
              <Plus size={24} strokeWidth={1.5} />
            </div>
            <span>{t('testimonials_btn_add_review')}</span>
          </button>
        </div>
      )
    }
    
    const testimonial = item as Testimonial
    return (
      <div key={`${index}-${testimonial._id}`} className={`${styles.testimonialCard} hover-trigger`}>
        <div className={`${styles.card} hover-trigger`}>
          <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
          <div className={`${styles.corner} ${styles.cornerTopRight}`} />
          <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
          <div className={`${styles.corner} ${styles.cornerBottomRight}`} />

          <div className={styles.quoteIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            </svg>
          </div>
          <p className={`${styles.text} ${testimonial.review.length > TEXT_TRUNCATE_LIMIT ? styles.textClamped : ''}`}>{testimonial.review}</p>
          {testimonial.review.length > TEXT_TRUNCATE_LIMIT && (
            <button
              className={styles.showMoreBtn}
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              {t('testimonials_show_more')}
            </button>
          )}
          <div className={styles.author}>
            <div className={styles.avatar}>{getInitials(testimonial.fullName)}</div>
            <div>
              <div className={styles.name}>{testimonial.fullName}</div>
              <div className={styles.project}>{testimonial.projectType || t('testimonials_client_fallback')}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section ref={sectionRef} className={styles.testimonials} id="testimonials">
        <div className="container-fluid">
          <div className={styles.header}>
            <div>
              <span className={styles.label}>
                {sectionNumber !== undefined
                  ? `${sectionNumber.toString().padStart(2, '0')}. ${t('testimonials_label')}`
                  : t('testimonials_label')}
              </span>
              <h2 className={styles.title}>
                <span className="hover-trigger">{t('testimonials_title')}</span>
              </h2>
            </div>

            <div className={styles.controls}>
              {testimonials.length > 0 && (
                <>
                  <button
                    className={`${styles.controlBtn} hover-trigger`}
                    onClick={() => handleScrollByCard('left')}
                    aria-label="Scroll left"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    className={`${styles.controlBtn} hover-trigger`}
                    onClick={() => handleScrollByCard('right')}
                    aria-label="Scroll right"
                  >
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              <button
                className={`${styles.controlBtn} hover-trigger`}
                onClick={handleShareReviewLink}
                aria-label="Share review link"
                title="Share review link"
              >
                <Share2 size={16} />
              </button>
              {showShareCopied && (
                <span className={styles.shareToast} role="status" aria-live="polite">
                  Link copied!
                </span>
              )}
            </div>
          </div>

          <div className={styles.scrollWrapper}>
            <div
              className={`${styles.scrollContainer} ${isMobileClient ? styles.mobileScrollContainer : ''} ${testimonials.length === 0 ? styles.scrollContainerEmpty : ''}`}
              ref={isMobileClient ? mobileViewportRef : scrollRef}
              id="testimonials-scroll"
              onMouseEnter={!isMobileClient ? handleMouseEnter : undefined}
              onMouseLeave={!isMobileClient ? handleMouseLeave : undefined}
            >
              {isMobileClient ? (
                <motion.div
                  ref={mobileTrackRef}
                  className={styles.motionTrack}
                  style={{ x: mobileX }}
                >
                  {mobileItems.map((item, index) => renderTestimonialItem(item, index))}
                </motion.div>
              ) : (
                <motion.div
                  ref={desktopTrackRef}
                  className={styles.motionTrack}
                  style={{ x: desktopX }}
                >
                  {desktopItems.map((item, index) => renderTestimonialItem(item, index))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Modal - Using Portal */}
      {mounted && typeof window !== 'undefined' && document.body && createPortal(modalContent, document.body)}

      {/* View Testimonial Modal - Using Portal */}
      {mounted && typeof window !== 'undefined' && document.body && createPortal(viewModalContent, document.body)}

      {/* Thank You Message */}
      <ThankYouMessage
        message={t('testimonials_thankyou')}
        show={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </>
  )
}
