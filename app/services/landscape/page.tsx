import LandscapeHero from '@/components/services/consist-of/landscape/LandscapeHero'
import LandscapeOverview from '@/components/services/consist-of/landscape/LandscapeOverview'
import LandscapeSpecialties from '@/components/services/consist-of/landscape/LandscapeSpecialties'
import LandscapeFAQ from '@/components/services/consist-of/landscape/LandscapeFAQ'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Landscape Architecture',
  description:
    'Landscape architecture services in Paris, the French Riviera (Côte d’Azur), and Beirut for gardens, terraces, pool areas, pathways, and outdoor living spaces. We create refined landscapes through hardscaping, softscaping, biodiversity-conscious planting, and seamless integration between architecture and nature.',
  alternates: {
    canonical: '/services/landscape',
  },
  openGraph: {
    title: 'Landscape Architecture | Gardens, Terraces & Outdoor Living',
    description:
      'Landscape architecture services for gardens, pool areas, terraces, and outdoor living spaces in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/landscape',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Landscape Architecture by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Landscape Architecture in Paris, French Riviera & Beirut',
    description:
      'Gardens, terraces, pool areas, and outdoor living spaces designed to connect architecture with nature.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dibeh-architecture.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.dibeh-architecture.com/services' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Landscape',
      item: 'https://www.dibeh-architecture.com/services/landscape',
    },
  ],
}

export default function LandscapePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LandscapeHero />
      <LandscapeOverview />
      <LandscapeSpecialties />
      <LandscapeFAQ />
    </>
  )
}

