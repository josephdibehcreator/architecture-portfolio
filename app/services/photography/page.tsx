import PhotographyHero from '@/components/services/consist-of/photography/PhotographyHero'
import PhotographyOverview from '@/components/services/consist-of/photography/PhotographyOverview'
import PhotographySpecialties from '@/components/services/consist-of/photography/PhotographySpecialties'
import PhotographyFAQ from '@/components/services/consist-of/photography/PhotographyFAQ'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Architectural Photography & Virtual Tours',
  description:
    'Architectural photography and virtual tour services in Paris, the French Riviera (Côte d’Azur), and Beirut for real estate, hospitality, retail, office, and luxury properties. We create high-end imagery, immersive walkthroughs, and visual content that strengthen brand perception, engagement, and conversion.',
  alternates: {
    canonical: '/services/photography',
  },
  openGraph: {
    title: 'Architectural Photography & Virtual Tours | Real Estate, Hospitality & Commercial',
    description:
      'High-end architectural photography and immersive virtual tours for real estate, hospitality, retail, and commercial spaces in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/photography',
    siteName: 'Dibeh Architecture',
    type: 'article',
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
    title: 'Architectural Photography & Virtual Tours in Paris, French Riviera & Beirut',
    description:
      'High-end property imagery and immersive virtual tours for real estate, hospitality, retail, and commercial spaces.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

export default function PhotographyPage() {
  return (
    <>
      <PhotographyHero />
      <PhotographyOverview />
      <PhotographySpecialties />
      <PhotographyFAQ />
    </>
  )
}

