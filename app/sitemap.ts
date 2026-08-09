import { MetadataRoute } from 'next'

/**
 * This sitemap helps search engines discover and index all public pages
 * of the Dibeh Architecture website. It excludes admin pages and includes
 * both static pages and dynamically generated project, blog, and news pages.
 *
 * Priority Guidelines:
 * - 1.0: Homepage (most important)
 * - 0.9: Main sections (About, Services, Projects listing)
 * - 0.8: Individual service pages, News/Blog listing
 * - 0.7: Individual project pages, Blog articles, News articles
 *
 * Change Frequency Guidelines:
 * - daily: Homepage and Projects listing
 * - weekly: Services and News/Blog listings
 * - monthly: Static pages and individual detail pages that rarely change
 */

export const revalidate = 3600

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
} as const

interface SitemapProject {
  slug: string
  updatedAt: string
}

type PublishStatus = 'draft' | 'published'

interface SitemapBlog {
  slug: string
  status?: PublishStatus | string
  updatedAt?: string
  publishedAt?: string
  createdAt?: string
}

interface SitemapNews {
  slug: string
  status?: PublishStatus | string
  updatedAt?: string
  publishedAt?: string
  createdAt?: string
}

interface SitemapFetchResult<T> {
  data: T[]
  error?: string
}

interface ApiListItem {
  slug?: string
  status?: PublishStatus | string
  updatedAt?: string
  publishedAt?: string
  createdAt?: string
}

/**
 * Gets the API base URL for sitemap fetch.
 * On Vercel/build: never use localhost; use NEXT_PUBLIC_API_URL or production fallback.
 * Locally: use NEXT_PUBLIC_API_URL or localhost.
 */
function getApiBaseUrl(): string {
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      'https://architect-portfolio-backend-5bow.onrender.com/api'
    )
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
}

function normalizeListResponse<T extends ApiListItem>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    const data = obj.data

    if (Array.isArray(data)) return data as T[]

    if (data && typeof data === 'object') {
      const nested = data as Record<string, unknown>
      const nestedData = nested.data
      if (Array.isArray(nestedData)) return nestedData as T[]
    }
  }

  return []
}

function getLastModifiedDate(
  item: { updatedAt?: string; publishedAt?: string; createdAt?: string },
  fallback: Date
): Date {
  const candidate = item.updatedAt || item.publishedAt || item.createdAt
  if (!candidate) return fallback
  const parsed = new Date(candidate)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

function isPublishedItem(item: ApiListItem): boolean {
  return Boolean(item.slug) && (item.status ? item.status === 'published' : true)
}

async function fetchSitemapList<T extends ApiListItem>(
  endpoint: string,
  label: string
): Promise<SitemapFetchResult<T>> {
  try {
    const apiUrl = getApiBaseUrl()
    const response = await fetch(`${apiUrl}${endpoint}`, ISR_FETCH_OPTIONS)

    if (!response.ok) {
      const error = `[sitemap] Failed to fetch ${label}: HTTP ${response.status} ${response.statusText}`
      console.error(error)
      return { data: [], error }
    }

    const payload: unknown = await response.json()
    const items = normalizeListResponse<T>(payload).filter(isPublishedItem)

    return { data: items }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred while fetching data'
    const errorMessage = `[sitemap] Error fetching ${label}: ${message}`
    console.error(errorMessage)
    return { data: [], error: errorMessage }
  }
}

async function getProjects(): Promise<SitemapFetchResult<SitemapProject>> {
  const result = await fetchSitemapList<ApiListItem & { updatedAt?: string }>(
    '/projects',
    'projects'
  )

  return {
    data: result.data
      .filter((project) => project.status === 'published' && project.slug)
      .map((project) => ({
        slug: String(project.slug),
        updatedAt: project.updatedAt || new Date().toISOString(),
      })),
    error: result.error,
  }
}

async function getBlogs(): Promise<SitemapFetchResult<SitemapBlog>> {
  const result = await fetchSitemapList<SitemapBlog>('/blogs', 'blogs')

  return {
    data: result.data.map((blog) => ({
      slug: String(blog.slug),
      status: blog.status,
      updatedAt: blog.updatedAt,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
    })),
    error: result.error,
  }
}

async function getNews(): Promise<SitemapFetchResult<SitemapNews>> {
  const result = await fetchSitemapList<SitemapNews>('/news', 'news')

  return {
    data: result.data.map((news) => ({
      slug: String(news.slug),
      status: news.status,
      updatedAt: news.updatedAt,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
    })),
    error: result.error,
  }
}

/**
 * Gets the base URL for the website
 * Falls back to localhost in development, should be set via NEXT_PUBLIC_SITE_URL in production
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://www.dibeh-architecture.com'
}

function buildStaticPages(baseUrl: string, currentDate: Date): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/architecture`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/interior-design`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/landscape`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/3d-scanning`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/photography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/preliminary-declaration-approvals`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/3d-printing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/branding`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}

function resolveSettledResult<T>(
  result: PromiseSettledResult<SitemapFetchResult<T>>,
  label: string
): SitemapFetchResult<T> {
  if (result.status === 'fulfilled') {
    if (result.value.error) {
      console.error(
        `[sitemap] ${label} fetch failed — dynamic ${label} URLs will be omitted from this sitemap generation:`,
        result.value.error
      )
    }
    return result.value
  }

  const message =
    result.reason instanceof Error ? result.reason.message : 'Unknown rejection reason'
  const error = `[sitemap] ${label} fetch rejected: ${message}`
  console.error(error)
  return { data: [], error }
}

/**
 * Main sitemap generator function.
 * Always returns static core pages even when dynamic API fetches fail.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const currentDate = new Date()
  const staticPages = buildStaticPages(baseUrl, currentDate)

  const [projectsResult, blogsResult, newsResult] = await Promise.allSettled([
    getProjects(),
    getBlogs(),
    getNews(),
  ])

  const projects = resolveSettledResult(projectsResult, 'projects')
  const blogs = resolveSettledResult(blogsResult, 'blogs')
  const newsItems = resolveSettledResult(newsResult, 'news')

  const dynamicFetchFailed =
    Boolean(projects.error) && Boolean(blogs.error) && Boolean(newsItems.error)

  if (dynamicFetchFailed) {
    console.error(
      '[sitemap] All dynamic fetches failed — returning static core pages only. ' +
        'Google will still index Home, About, Services, and other static routes.'
    )
  }

  const projectPages: MetadataRoute.Sitemap = projects.data.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = blogs.data.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: getLastModifiedDate(blog, currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const newsPages: MetadataRoute.Sitemap = newsItems.data.map((news) => ({
    url: `${baseUrl}/news/${news.slug}`,
    lastModified: getLastModifiedDate(news, currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages, ...blogPages, ...newsPages]
}
