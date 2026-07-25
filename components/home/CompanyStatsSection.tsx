'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { type HomepageStatsData } from '@/services/homepageStats'
import styles from './CompanyStatsSection.module.css'

type StatItemProps = {
  value: number
  suffix?: string
  label: string
  duration?: number
}

function StatItem({ value, suffix = '', label, duration = 1400 }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const latestCountRef = useRef(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    let startTime: number | null = null
    let frameId = 0
    const startValue = latestCountRef.current
    const delta = value - startValue

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextCount = Math.round(startValue + delta * eased)
      setCount(nextCount)
      latestCountRef.current = nextCount

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
      }
    }

    frameId = window.requestAnimationFrame(step)

    return () => window.cancelAnimationFrame(frameId)
  }, [started, value, duration])

  return (
    <div ref={ref} className={styles.statCard}>
      <div className={styles.statFrame}>
        <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
        <div className={`${styles.corner} ${styles.cornerTopRight}`} />
        <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
        <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
        <span className={styles.statValue}>
          {count}
          {suffix}
        </span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  )
}

interface CompanyStatsSectionProps {
  initialStats?: HomepageStatsData | null
}

export default function CompanyStatsSection({ initialStats }: CompanyStatsSectionProps = {}) {
  const { t } = useLanguage()

  if (!initialStats?.items?.length) {
    return null
  }

  return (
    <section className={styles.section} aria-label={t('stats_title') || 'Company statistics'}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {initialStats.items.slice(0, 3).map((item, index) => (
            <StatItem
              key={`${item.label}-${index}`}
              value={item.value}
              suffix={item.suffix}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}