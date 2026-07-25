import { MetadataRoute } from 'next'

/**
 * robots.ts – Next.js App Router robots.txt
 *
 * Allows search engines to crawl all public pages.
 * Blocks /admin and /api for privacy and to avoid indexing internal/API routes.
 * References the sitemap for Google Search Console and other crawlers.
 *
 * Production URL: https://www.dibeh-architecture.com/robots.txt
 * Sitemap: https://www.dibeh-architecture.com/sitemap.xml
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
    sitemap: 'https://www.dibeh-architecture.com/sitemap.xml',
  }
}
