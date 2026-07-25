import type { Metadata } from 'next'
import NewsSection from '@/components/news/NewsSection'
import PressGrid from '@/components/news/PressGrid'
import { getBlogs, type Blog } from '@/services/blogs'
import { getNews, type News } from '@/services/news'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

export const metadata: Metadata = {
  title: 'Blogs and News',
  description:
    'Explore the latest articles, press features, and design insights from Dibeh Architecture, covering architecture, interior design, renovation, landscape, and hospitality in Paris, the French Riviera (Côte d’Azur), and Beirut.',
  alternates: {
    canonical: '/news',
   
  },
  openGraph: {
    title: 'News & Press | Dibeh Architecture',
    description:
      'Articles, press features, and design insights from Dibeh Architecture across architecture, interiors, renovation, and landscape in Paris, the French Riviera, and Beirut.',
    url: 'https://www.dibeh-architecture.com/news',
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

export default async function NewsPage() {
  let initialBlogs: Blog[] = []
  let initialNews: News[] = []

  try {
    const [blogsResponse, newsResponse] = await Promise.all([
      getBlogs({ limit: 3 }, ISR_FETCH_OPTIONS),
      getNews({ limit: 50 }, ISR_FETCH_OPTIONS),
    ])

    if (blogsResponse.success && blogsResponse.data) {
      initialBlogs = blogsResponse.data.data || []
    }
    if (newsResponse.success && newsResponse.data) {
      initialNews = newsResponse.data.data || []
    }
  } catch (error) {
    console.error('Error fetching news page data:', error)
  }

  return (
    <>
      <NewsSection initialBlogs={initialBlogs} />
      <PressGrid initialNews={initialNews} />
    </>
  )
}

