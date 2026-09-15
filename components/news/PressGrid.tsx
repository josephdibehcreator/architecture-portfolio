'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { type News } from '@/services/news'
import styles from './PressGrid.module.css'

interface PressGridProps {
  initialNews?: News[]
}

export default function PressGrid({ initialNews = [] }: PressGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  if (initialNews.length === 0) {
    return null
  }

  return (
    <section className={styles.press}>
      <div className="container-fluid">
        <div className={styles.header}>
          <span className={styles.label}>Features & Mentions</span>
          <h2 className={styles.title}>Press</h2>
        </div>

        <div className={styles.grid}>
          {initialNews.map((item) => (
            <Link key={item._id} href={`/news/${item.slug}`} className={`${styles.card} hover-trigger`} title={item.title}>
              <div className={styles.corner} data-position="top-left"></div>
              <div className={styles.corner} data-position="top-right"></div>
              <div className={styles.corner} data-position="bottom-left"></div>
              <div className={styles.corner} data-position="bottom-right"></div>

              <div className={styles.imageContainer}>
                {item.coverImage?.url && (
                  <>
                    <Image
                      src={item.coverImage.url}
                      alt={item.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.dateBadge}>
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.content}>
                <div className={styles.contentHeader}>
                  <span className={styles.source}>{item.source}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.footer}>
                  <span className={styles.readMore}>Read Feature</span>
                  <ArrowDown size={16} className={styles.arrow} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

