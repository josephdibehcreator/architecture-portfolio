import type { Metadata } from 'next'
import NewsSection from '@/components/news/NewsSection'
import PressGrid from '@/components/news/PressGrid'
import Pagination from '@/components/shared/Pagination'
import { getBlogs, type Blog } from '@/services/blogs'
import { getNews, type News } from '@/services/news'
import { fetchPageWithClamp, parsePageParam } from '@/services/pagination'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

const BLOGS_PER_PAGE = 9
const NEWS_PER_PAGE = 9

type NewsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const blogPage = parsePageParam(resolvedSearchParams.blogPage)
  const newsPage = parsePageParam(resolvedSearchParams.newsPage)

  // Self-referencing canonical on paginated pages so ?blogPage=2+ stays indexable
  const canonicalParams = new URLSearchParams()
  if (blogPage > 1) canonicalParams.set('blogPage', String(blogPage))
  if (newsPage > 1) canonicalParams.set('newsPage', String(newsPage))
  const canonicalQuery = canonicalParams.toString()

  return {
    title: 'Blog & Press',
    description:
      'Explore the latest articles, press features, and design insights from Dibeh Architecture, covering architecture, interior design, renovation, landscape, and hospitality in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    alternates: {
      canonical: canonicalQuery ? `/news?${canonicalQuery}` : '/news',

    },
    openGraph: {
      title: 'News & Press | Dibeh Architecture',
      description:
        'Articles, press features, and design insights from Dibeh Architecture across architecture, interiors, renovation, and landscape in Paris, the French Riviera, and Beirut.',
      url: '/news',
      siteName: 'Dibeh Architecture',
      type: 'website',
      images: [
        {
          url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
          width: 1200,
          height: 630,
          alt: 'Press and Blog by Dibeh Architecture',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'News & Press | Dibeh Architecture',
      description:
        'Read the latest articles, features, and design insights from Dibeh Architecture in Paris, the French Riviera, and Beirut.',
      images: [
        'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
      ],
    },
  }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = await searchParams
  const requestedBlogPage = parsePageParam(resolvedSearchParams.blogPage)
  const requestedNewsPage = parsePageParam(resolvedSearchParams.newsPage)

  let blogs: Blog[] = []
  let news: News[] = []
  let blogPage = requestedBlogPage
  let newsPage = requestedNewsPage
  let blogTotalPages = 1
  let newsTotalPages = 1

  try {
    const [blogsResult, newsResult] = await Promise.all([
      fetchPageWithClamp(
        (page) => getBlogs({ page, limit: BLOGS_PER_PAGE }, ISR_FETCH_OPTIONS),
        requestedBlogPage
      ),
      fetchPageWithClamp(
        (page) => getNews({ page, limit: NEWS_PER_PAGE }, ISR_FETCH_OPTIONS),
        requestedNewsPage
      ),
    ])

    blogs = blogsResult.items
    blogPage = blogsResult.page
    blogTotalPages = blogsResult.totalPages

    news = newsResult.items
    newsPage = newsResult.page
    newsTotalPages = newsResult.totalPages
  } catch (error) {
    console.error('Error fetching news page data:', error)
  }

  return (
    <>
      <NewsSection initialBlogs={blogs} />
      <Pagination
        currentPage={blogPage}
        totalPages={blogTotalPages}
        basePath="/news"
        pageParam="blogPage"
        searchParams={resolvedSearchParams}
      />
      <PressGrid initialNews={news} />
      <Pagination
        currentPage={newsPage}
        totalPages={newsTotalPages}
        basePath="/news"
        pageParam="newsPage"
        searchParams={resolvedSearchParams}
      />
    </>
  )
}
