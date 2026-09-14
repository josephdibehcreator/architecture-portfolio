/**
 * Canonical public origin of the website.
 *
 * REQUIRED environment variable — no fallback. Every SEO surface (canonical
 * URLs, Open Graph urls, JSON-LD schemas, robots.ts, sitemap) derives from it,
 * so a missing value must fail the build instead of silently emitting URLs
 * for the wrong domain.
 *
 *   Local development: http://localhost:3000
 *   Production (Vercel): https://www.dibeh-architecture.com
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')

if (!rawSiteUrl) {
  throw new Error(
    'FATAL: NEXT_PUBLIC_SITE_URL is not set. ' +
      'It is required for canonical URLs, Open Graph metadata, structured data, robots.txt, and the sitemap. ' +
      'Add it to .env.local (http://localhost:3000) and to the Vercel project settings ' +
      '(https://www.dibeh-architecture.com), then rebuild.'
  )
}

const SITE_URL = rawSiteUrl

export function getSiteUrl(): string {
  return SITE_URL
}
