import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getNews, getNewsBySlug, type News } from '@/services/news'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import styles from './page.module.css'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = []
    let page = 1
    let totalPages = 1

    do {
      const response = await getNews({ page, limit: 50 }, ISR_FETCH_OPTIONS)

      if (!response.success || !response.data) {
        console.error(
          '[generateStaticParams/news] Failed to fetch news:',
          response.message ?? 'Unknown error'
        )
        break
      }

      const items = response.data.data ?? []
      slugs.push(
        ...items
          .filter((item) => item.slug)
          .map((item) => ({ slug: item.slug }))
      )

      totalPages = response.data.pagination?.totalPages ?? 1
      page++
    } while (page <= totalPages)

    return slugs
  } catch (error) {
    console.error('[generateStaticParams/news] Error fetching news:', error)
    return []
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

async function fetchNews(slug: string): Promise<News | null> {
  const response = await getNewsBySlug(slug, ISR_FETCH_OPTIONS)
  if (!response.success || !response.data) return null
  return response.data
}

/**
 * Keeps the rendered <title> within Google's ~60 character display limit.
 * The layout template appends " | Dibeh Architecture" (21 chars), so short titles
 * are left alone and get the brand suffix; longer CMS titles keep the full headline
 * instead and drop the suffix, since the headline carries the ranking keywords.
 */
const BRAND_SUFFIX_LENGTH = ' | Dibeh Architecture'.length
const MAX_TITLE_LENGTH = 60

function truncateOnWord(value: string, max: number): string {
  if (value.length <= max) return value
  const trimmed = value.slice(0, max - 1)
  const lastSpace = trimmed.lastIndexOf(' ')
  return `${(lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed).trimEnd()}…`
}

function buildTitle(value: string): Metadata['title'] {
  if (value.length <= MAX_TITLE_LENGTH - BRAND_SUFFIX_LENGTH) return value
  return { absolute: truncateOnWord(value, MAX_TITLE_LENGTH) }
}

/** Plain-text body for Article structured data (schema.org expects text, not markup). */
function toPlainText(html: string): string {
  return sanitizeHtml(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await fetchNews(slug)

  if (!news) {
    return {
      title: 'News Not Found',
    }
  }

  const title = news.title
  const description =
    news.excerpt ||
    'Read the latest news and updates from Dibeh Architecture across Paris, the French Riviera (Côte d’Azur), and Beirut.'
  const image = news.coverImage?.url
  const url = `https://www.dibeh-architecture.com/news/${slug}`

  return {
    title: buildTitle(title),
    description,
    alternates: {
      canonical: `/news/${slug}`,
     
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dibeh Architecture',
      type: 'article',
      publishedTime: news.publishedAt,
      authors: news.source ? [news.source] : ['Dibeh Architecture'],
      images: image
        ? [
            {
              url: image,
              alt: news.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await fetchNews(slug)

  if (!news) notFound()

  const canonicalUrl = `https://www.dibeh-architecture.com/news/${slug}`
  const articleBody = toPlainText(news.content)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt || news.title,
    articleBody: articleBody || news.excerpt || news.title,
    inLanguage: 'en',
    image: news.coverImage?.url || undefined,
    datePublished: news.publishedAt || news.createdAt,
    dateModified: news.updatedAt || news.publishedAt || news.createdAt,
    author: {
      '@type': 'Organization',
      name: news.source || 'Dibeh Architecture',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dibeh Architecture',
      logo: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
      },
    },
    articleSection: news.source || undefined,
    mainEntityOfPage: canonicalUrl,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dibeh-architecture.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog & Press', item: 'https://www.dibeh-architecture.com/news' },
      { '@type': 'ListItem', position: 3, name: news.title, item: canonicalUrl },
    ],
  }

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {news.coverImage?.url && (
        <div className={styles.coverImageWrapper}>
          <div className={styles.coverImage}>
            <Image
              src={news.coverImage.url}
              alt={news.title}
              fill
              className={styles.image}
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      <div className={styles.container}>
        <Link href="/news" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to News</span>
        </Link>

        <header className={styles.header}>
          <div className={styles.meta}>
            {news.source && <span className={styles.source}>{news.source}</span>}
            <span className={styles.date}>{formatDate(news.publishedAt)}</span>
          </div>
          <h1 className={styles.title}>{news.title}</h1>
          {news.excerpt && <p className={styles.excerpt}>{news.excerpt}</p>}
        </header>

        <div className={styles.content}>
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }}
          />
        </div>
      </div>
    </article>
  )
}