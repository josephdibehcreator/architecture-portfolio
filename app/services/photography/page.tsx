import PhotographyHero from '@/components/services/consist-of/photography/PhotographyHero'
import PhotographyOverview from '@/components/services/consist-of/photography/PhotographyOverview'
import PhotographySpecialties from '@/components/services/consist-of/photography/PhotographySpecialties'
import PhotographyFAQ from '@/components/services/consist-of/photography/PhotographyFAQ'
import { getSiteUrl } from '@/utils/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Architectural Photography',
  description:
    'Architectural photography and virtual tour services in Paris, the French Riviera (Côte d’Azur), and Beirut for real estate, hospitality, retail, office, and luxury properties. We create high-end imagery, immersive walkthroughs, and visual content that strengthen brand perception, engagement, and conversion.',
  alternates: {
    canonical: '/services/photography',
  },
  openGraph: {
    title: 'Architectural Photography & 360° Virtual Tours for Real Estate',
    description:
      'High-end architectural photography and immersive virtual tours for real estate, hospitality, retail, and commercial spaces in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: '/services/photography',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Architectural Photography and Virtual Tours by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural Photography & 360° Tours in Paris & Beirut',
    description:
      'High-end property imagery and immersive virtual tours for real estate, hospitality, retail, and commercial spaces.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${getSiteUrl()}/services` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Photography',
      item: `${getSiteUrl()}/services/photography`,
    },
  ],
}

export default function PhotographyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PhotographyHero />
      <PhotographyOverview />
      <PhotographySpecialties />
      <PhotographyFAQ />
    </>
  )
}

