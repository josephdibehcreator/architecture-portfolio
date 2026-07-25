import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getBlogs, getBlogBySlug, type Blog } from '@/services/blogs'
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
      const response = await getBlogs({ page, limit: 50 }, ISR_FETCH_OPTIONS)

      if (!response.success || !response.data) {
        console.error(
          '[generateStaticParams/blogs] Failed to fetch blogs:',
          response.message ?? 'Unknown error'
        )
        break
      }

      const items = response.data.data ?? []
      slugs.push(
        ...items
          .filter((blog) => blog.slug)
          .map((blog) => ({ slug: blog.slug }))
      )

      totalPages = response.data.pagination?.totalPages ?? 1
      page++
    } while (page <= totalPages)

    return slugs
  } catch (error) {
    console.error('[generateStaticParams/blogs] Error fetching blogs:', error)
    return []
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

async function fetchBlog(slug: string): Promise<Blog | null> {
  const response = await getBlogBySlug(slug, ISR_FETCH_OPTIONS)
  if (!response.success || !response.data) return null
  return response.data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await fetchBlog(slug)

  if (!blog) {
    return {
      title: 'Article Not Found',
    }
  }

  const title = blog.title
  const description =
    blog.excerpt ||
    'Read the latest design insights from Dibeh Architecture across Paris, the French Riviera (Côte d’Azur), and Beirut.'
  const image = blog.coverImage?.url
  const url = `https://www.dibeh-architecture.com/blogs/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `/blogs/${slug}`,
    
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dibeh Architecture',
      type: 'article',
      publishedTime: blog.createdAt,
      authors: blog.author ? [blog.author] : ['Dibeh Architecture'],
      images: image
        ? [
            {
              url: image,
              alt: blog.title,
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

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await fetchBlog(slug)

  if (!blog) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.title,
    articleBody: blog.excerpt || blog.title,
    image: blog.coverImage?.url || undefined,
    author: {
      '@type': 'Person',
      name: blog.author || 'Dibeh Architecture',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dibeh Architecture',
      logo: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    articleSection: blog.category || undefined,
    mainEntityOfPage: `https://www.dibeh-architecture.com/blogs/${slug}`,
  }

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {blog.coverImage?.url && (
        <div className={styles.coverImageWrapper}>
          <div className={styles.coverImage}>
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className={styles.image}
              sizes="100vw"
              priority
            />
          </div>
          {blog.coverImageCredit && blog.coverImageCredit.trim() && (
            <p className={styles.imageCredit}>{blog.coverImageCredit}</p>
          )}
        </div>
      )}

      <div className={styles.container}>
        <Link href="/news" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Back to Blog</span>
        </Link>

        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{blog.category}</span>
            <span className={styles.date}>{formatDate(blog.createdAt)}</span>
            {blog.author && <span className={styles.author}>By {blog.author}</span>}
          </div>
          <h1 className={styles.title}>{blog.title}</h1>
          {blog.excerpt && <p className={styles.excerpt}>{blog.excerpt}</p>}
        </header>

        <div className={styles.content}>
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
          />
        </div>
      </div>
    </article>
  )
}