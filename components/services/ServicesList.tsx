'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  PencilRuler,
  Armchair,
  Trees,
  ScanLine,
  Camera,
  ScrollText,
  Printer,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { animate, motion, useReducedMotion, useMotionValue } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ServicesList.module.css'

// SHARED MOBILE SCROLL SPEED CONSTANT (pixels per second)
// This ensures both Testimonials and Services sections scroll at the EXACT same visual speed
// Desktop uses different logic (scrollLeft + RAF) and is NOT affected by this constant
const MOBILE_SCROLL_PX_PER_SEC = 80

// Desktop: smooth transform-based scroll speed (pixels per second)
const DESKTOP_SCROLL_PX_PER_SEC = 110

// Mobile card dimensions — must match .serviceCard CSS (300px width, 1.5rem gap)
const MOBILE_CARD_WIDTH = 300
const MOBILE_CARD_GAP = 24

export interface Service {
  icon: LucideIcon
  title: string
  description: string
  comingSoon?: boolean
  href?: string
}

// Helper function to get service route
const getServiceRoute = (title: string): string => {
  const routeMap: Record<string, string> = {
    'Architecture': '/services/architecture',
    'Interior Design': '/services/interior-design',
    'Landscape': '/services/landscape',
    '3D Scanning': '/services/3d-scanning',
    'Architecture Photography': '/services/photography',
    'Preliminary Declaration & Approvals': '/services/preliminary-declaration-approvals',
    '3D Printing': '/services/3d-printing',
    'Branding & Digital Presence': '/services/branding',
  }
  return routeMap[title] || '#'
}

// Services will be created dynamically with translations

interface ServicesListProps {
  title?: string
  showLink?: boolean
  linkHref?: string
  sectionNumber?: number
}

export default function ServicesList({ title, showLink = false, linkHref = '/services', sectionNumber }: ServicesListProps) {
  const { t } = useLanguage()
  const displayTitle = title || t('services_title')
  
  const services: Service[] = useMemo(() => [
    { icon: PencilRuler, title: t('service_architecture_title'), description: t('service_architecture_desc'), href: '/services/architecture' },
    { icon: Armchair, title: t('service_interior_title'), description: t('service_interior_desc'), href: '/services/interior-design' },
    { icon: Trees, title: t('service_landscape_title'), description: t('service_landscape_desc'), href: '/services/landscape' },
    { icon: ScanLine, title: t('service_3d_scanning_title'), description: t('service_3d_scanning_desc'), comingSoon: true, href: '/services/3d-scanning' },
    { icon: Camera, title: t('service_photography_title'), description: t('service_photography_desc'), href: '/services/photography' },
    { icon: ScrollText, title: t('service_permits_title'), description: t('service_permits_desc'), href: '/services/preliminary-declaration-approvals' },
    { icon: Printer, title: t('service_3d_printing_title'), description: t('service_3d_printing_desc'), comingSoon: true, href: '/services/3d-printing' },
    { icon: Sparkles, title: t('service_branding_title'), description: t('service_branding_desc'), href: '/services/branding' },
  ], [t])
  
  // Mobile-specific animation state
  const [isMobileClient, setIsMobileClient] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Mobile: separate transform-driven marquee branch
  const mobileViewportRef = useRef<HTMLDivElement | null>(null)
  const mobileTrackRef = useRef<HTMLDivElement | null>(null)
  const mobileX = useMotionValue(0)
  const mobileIsTouchingRef = useRef(false)

  // Desktop: transform-based infinite carousel (Framer Motion x)
  const scrollRef = useRef<HTMLDivElement | null>(null) // desktop viewport container
  const desktopTrackRef = useRef<HTMLDivElement | null>(null)
  const desktopX = useMotionValue(0)
  const desktopAnimationRef = useRef<number | null>(null)
  const desktopLastTimeRef = useRef<number>(0)
  const desktopPauseTimeoutRef = useRef<number | null>(null)
  const desktopArrowAnimStopRef = useRef<null | (() => void)>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [desktopSetWidth, setDesktopSetWidth] = useState(0)
  const desktopMeasured = useRef({ cardPlusGap: 0, singleSetWidth: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  // Desktop: Keep three sets for seamless transform-based wrap
  const duplicatedServices = useMemo(() => [...services, ...services, ...services], [services])
  
  // Mobile: Duplicate 2 times for Framer Motion 0% -> -50% infinite loop
  const mobileDuplicatedServices = useMemo(() => [...services, ...services], [services])

  // Detect mobile viewport on the client to switch between desktop (scrollLeft) and mobile (Framer Motion) logic
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const updateIsMobile = (matches: boolean) => {
      setIsMobileClient(matches)
    }

    updateIsMobile(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      updateIsMobile(event.matches)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  // Mobile: RAF loop — uses fixed card dimensions from CSS (no DOM measurement needed)
  useEffect(() => {
    if (!isMobileClient) return
    if (prefersReducedMotion) return

    const singleSetWidth =
      MOBILE_CARD_WIDTH * services.length + MOBILE_CARD_GAP * (services.length - 1)

    if (!singleSetWidth) return

    let rafId: number
    let lastTime = performance.now()

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 50)
      lastTime = time

      // Pause auto-scroll while finger is held down
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
  }, [isMobileClient, prefersReducedMotion, services.length, mobileX])

  useEffect(() => {
    if (!isMobileClient) return
    const viewport = mobileViewportRef.current
    if (!viewport) return

    const SWIPE_THRESHOLD = 5
    const MOMENTUM_DECAY = 0.95 // velocity multiplier per frame (~60fps)
    const MIN_VELOCITY = 0.5 // px/frame — stop momentum below this

    let touchStartX = 0
    let touchStartY = 0
    let lastTouchX = 0
    let lastTouchTime = 0
    let velocity = 0 // px/ms at release
    let isSwiping = false
    let startX = 0
    let momentumRafId = 0

    const singleSetWidth =
      MOBILE_CARD_WIDTH * services.length + MOBILE_CARD_GAP * (services.length - 1)

    const normalize = (x: number) => {
      if (x <= -singleSetWidth) return x + singleSetWidth
      if (x > 0) return x - singleSetWidth
      return x
    }

    const stopMomentum = () => {
      if (momentumRafId) {
        cancelAnimationFrame(momentumRafId)
        momentumRafId = 0
      }
    }

    const startMomentum = (initialVelocity: number) => {
      stopMomentum()
      let v = initialVelocity

      const tick = () => {
        if (Math.abs(v) < MIN_VELOCITY) {
          momentumRafId = 0
          return
        }
        const x = normalize(mobileX.get() + v)
        mobileX.set(x)
        v *= MOMENTUM_DECAY
        momentumRafId = requestAnimationFrame(tick)
      }

      momentumRafId = requestAnimationFrame(tick)
    }

    const onTouchStart = (e: TouchEvent) => {
      stopMomentum()
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      lastTouchX = touch.clientX
      lastTouchTime = performance.now()
      velocity = 0
      isSwiping = false
      startX = mobileX.get()
      mobileIsTouchingRef.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const dx = touch.clientX - touchStartX
      const dy = touch.clientY - touchStartY

      if (!isSwiping) {
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return
        if (Math.abs(dy) > Math.abs(dx)) {
          mobileIsTouchingRef.current = false
          return
        }
        isSwiping = true
      }

      e.preventDefault()

      // Track instantaneous velocity (px/ms)
      const now = performance.now()
      const dt = now - lastTouchTime
      if (dt > 0) velocity = (touch.clientX - lastTouchX) / dt
      lastTouchX = touch.clientX
      lastTouchTime = now

      mobileX.set(normalize(startX + dx))
    }

    const onTouchEnd = () => {
      mobileIsTouchingRef.current = false
      if (!isSwiping) return
      isSwiping = false

      // Convert velocity (px/ms) to px/frame at ~60fps, then launch momentum
      const frameVelocity = velocity * 16
      if (Math.abs(frameVelocity) > MIN_VELOCITY) {
        startMomentum(frameVelocity)
      }
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
  }, [isMobileClient, services.length, mobileX])

  // Desktop: measure card width + gap from DOM (single source of truth for arrows + wrap)
  const measureDesktop = () => {
    const viewport = scrollRef.current
    const track = desktopTrackRef.current
    if (!viewport || !track) return

    const firstCard = track.querySelector(`.${styles.serviceCard}`) as HTMLElement | null
    if (!firstCard) return

    const cardRect = firstCard.getBoundingClientRect()
    const computed = window.getComputedStyle(track)
    // Desktop gap matches the track gap; fallback to 24px.
    const gapStr = computed.getPropertyValue('gap') || computed.getPropertyValue('column-gap') || '24px'
    const gap = parseFloat(gapStr) || 24

    const cardWidth = Math.round(cardRect.width)
    const cardPlusGap = cardWidth + gap
    const singleSetWidth = cardPlusGap * services.length

    desktopMeasured.current = { cardPlusGap, singleSetWidth }
    setDesktopSetWidth(singleSetWidth)
  }

  // Intersection Observer to detect when section is visible (Desktop only: start/stop RAF)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    // Desktop-only
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
        threshold: 0.05, // Trigger when 5% of section is visible (more sensitive)
        rootMargin: '100px' // Start earlier before section enters viewport
      }
    )

    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Desktop: measure + initialize x to middle set, and keep stable on resize
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobileClient) return
    if (!scrollRef.current) return

    const applyInitialPosition = () => {
      measureDesktop()
      const { singleSetWidth } = desktopMeasured.current
      if (!singleSetWidth) return

      // Middle set start: [-2W, -W). We start exactly at -W (beginning of middle set).
      desktopX.set(-singleSetWidth)
    }

    // Measure after layout settles
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

        // Preserve relative offset within one set.
        const offsetInSet = ((-prevX) % prevW + prevW) % prevW
        desktopX.set(-nextW - Math.min(offsetInSet, nextW))
      }, 140)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [isMobileClient, desktopX])

  // Desktop: auto-scroll RAF loop (transform-based) with seamless wrap
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobileClient) return
    if (!isVisible) return

    // Always respect reduced motion on desktop transform animations.
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

      // Move left (negative x) for the same direction as mobile.
      let x = desktopX.get() - move

      // Keep x in [-2W, -W) so we always render the middle set region.
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

  // Desktop: pause/resume on user interaction (pointer + wheel)
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
    const singleSetWidth =
      MOBILE_CARD_WIDTH * services.length + MOBILE_CARD_GAP * (services.length - 1)
    const step = MOBILE_CARD_WIDTH + MOBILE_CARD_GAP

    let x = mobileX.get()
    x = direction === 'left' ? x + step : x - step
    if (x <= -singleSetWidth) x += singleSetWidth
    else if (x > 0) x -= singleSetWidth
    mobileX.set(x)
  }

  // Desktop: move by one card width + gap using desktopX (exact step size)
  const scrollDesktopByCard = (direction: 'left' | 'right') => {
    if (isMobileClient) return
    if (prefersReducedMotion) {
      // Reduced motion: jump instantly with wrap normalization.
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

    // Keep within the middle-set window so the movement feels continuous.
    if (targetX <= -singleSetWidth * 2) targetX = targetX + singleSetWidth
    else if (targetX > -singleSetWidth) targetX = targetX - singleSetWidth

    const controls = animate(desktopX, targetX, { duration: 0.45, ease: [0.22, 1, 0.36, 1] })
    desktopArrowAnimStopRef.current = controls.stop

    // Resume after the button-driven movement finishes.
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

  return (
    <section ref={sectionRef} className={styles.services} id="services">
      <div className="container-fluid">
        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              {sectionNumber !== undefined
                ? `${sectionNumber.toString().padStart(2, '0')}. ${t('services_label')}`
                : t('services_label')}
            </span>
            <h2 className={styles.title}>
              {showLink ? (
                <Link href={linkHref} className="hover-trigger">
                  {displayTitle}
                </Link>
              ) : (
                <span className="hover-trigger">{displayTitle}</span>
              )}
            </h2>
          </div>

          <div className={styles.controls}>
            <button className={`${styles.controlBtn} hover-trigger`} onClick={() => handleScrollByCard('left')} aria-label="Scroll left">
              <ArrowLeft size={16} />
            </button>
            <button className={`${styles.controlBtn} hover-trigger`} onClick={() => handleScrollByCard('right')} aria-label="Scroll right">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div
          className={`${styles.scrollContainer} ${isMobileClient ? styles.mobileScrollContainer : ''}`}
          ref={isMobileClient ? mobileViewportRef : scrollRef}
          id="services-scroll"
          onMouseEnter={!isMobileClient ? handleMouseEnter : undefined}
          onMouseLeave={!isMobileClient ? handleMouseLeave : undefined}
        >
          {isMobileClient ? (
            <motion.div
              ref={mobileTrackRef}
              className={styles.motionTrack}
              style={{ x: mobileX }}
            >
              {mobileDuplicatedServices.map((service, index) => {
                const Icon = service.icon
                const serviceHref = service.href || getServiceRoute(service.title)
                const CardContent = (
                  <div className={`${styles.card} hover-trigger`}>
                    <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerTopRight}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomRight}`} />

                    <div className={styles.iconContainer}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>

                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{service.title}</h3>
                      {service.comingSoon && <span className={styles.badge}>{t('services_coming_soon')}</span>}
                    </div>

                    <p className={styles.cardDescription}>{service.description}</p>
                  </div>
                )

                return (
                  <div key={`${index}-${service.title}`} className={`${styles.serviceCard} hover-trigger`}>
                    {service.comingSoon ? (
                      CardContent
                    ) : (
                      <Link 
                        href={serviceHref} 
                        className={styles.cardLink}
                      >
                        {CardContent}
                      </Link>
                    )}
                  </div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              ref={desktopTrackRef}
              className={styles.motionTrack}
              style={{ x: desktopX }}
              // Desktop is transform-driven; we intentionally do not use drag here.
            >
              {duplicatedServices.map((service, index) => {
                const Icon = service.icon
                const serviceHref = service.href || getServiceRoute(service.title)
                const CardContent = (
                  <div className={`${styles.card} hover-trigger`}>
                    <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerTopRight}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomRight}`} />

                    <div className={styles.iconContainer}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>

                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{service.title}</h3>
                      {service.comingSoon && <span className={styles.badge}>{t('services_coming_soon')}</span>}
                    </div>

                    <p className={styles.cardDescription}>{service.description}</p>
                  </div>
                )

                return (
                  <div key={`${index}-${service.title}`} className={`${styles.serviceCard} hover-trigger`}>
                    {service.comingSoon ? (
                      CardContent
                    ) : (
                      <Link href={serviceHref} className={styles.cardLink}>
                        {CardContent}
                      </Link>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// Services are now dynamically generated with translations
// If you need static service data, create a separate export function

