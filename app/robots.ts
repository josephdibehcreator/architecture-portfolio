import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/utils/site'

/**
 * robots.ts – Next.js App Router robots.txt
 *
 * Allows search engines to crawl all public pages.
 * Blocks /admin and /api for privacy and to avoid indexing internal/API routes.
 * References the sitemap for Google Search Console and other crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
