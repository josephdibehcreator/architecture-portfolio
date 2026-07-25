'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { type Blog } from '@/services/blogs'
import styles from './BlogGrid.module.css'

interface NewsSectionProps {
  initialBlogs?: Blog[]
}

export default function NewsSection({ initialBlogs = [] }: NewsSectionProps) {
  const { t } = useLanguage()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  if (initialBlogs.length === 0) {
    return null
  }

  return (
    <>
      <section className={styles.header}>
        <div className="container-fluid">
          <div className={styles.content}>
            <span className={styles.label}>{t('news_label')}</span>
            <h1 className={styles.title}>{t('news_title')}</h1>
          </div>
        </div>
      </section>

      <section className={styles.blog}>
        <div className="container-fluid">
          <div className={styles.grid}>
            {initialBlogs.map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`} className={`${styles.card} hover-trigger`}>
                <div className={styles.corner} data-position="top-left"></div>
                <div className={styles.corner} data-position="top-right"></div>
                <div className={styles.corner} data-position="bottom-left"></div>
                <div className={styles.corner} data-position="bottom-right"></div>

                <div className={styles.imageContainer}>
                  {blog.coverImage?.url && (
                    <>
                      <Image
                        src={blog.coverImage.url}
                        alt={blog.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className={styles.imageOverlay}></div>
                      <div className={styles.dateBadge}>
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.contentCard}>
                  <div className={styles.contentHeader}>
                    <span className={styles.category}>{blog.category}</span>
                    <h3 className={styles.cardTitle}>{blog.title}</h3>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.footer}>
                    <span className={styles.readMore}>{t('news_read_article')}</span>
                    <ArrowRight size={16} className={styles.arrow} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

