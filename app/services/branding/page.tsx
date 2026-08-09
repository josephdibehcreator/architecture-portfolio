import type { Metadata } from 'next'
import BrandingHero from '@/components/services/consist-of/branding/BrandingHero'
import BrandingOverview from '@/components/services/consist-of/branding/BrandingOverview'
import BrandingSpecialties from '@/components/services/consist-of/branding/BrandingSpecialties'
import BrandingFAQ from '@/components/services/consist-of/branding/BrandingFAQ'

export const metadata: Metadata = {
  title: 'Branding & Digital Presence',
  description:
    'Branding and digital presence services in Paris, the French Riviera (Côte d’Azur), and Beirut for architects, hospitality brands, real estate businesses, and creative companies. We create strategic brand identity, SEO-focused websites, and refined digital experiences that elevate visibility and conversion.',
  alternates: {
    canonical: '/services/branding',
 
  },
  openGraph: {
    title: 'Branding & Digital Presence | Strategy, Identity & SEO',
    description:
      'Strategic branding, visual identity, and SEO-focused digital presence services for businesses in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/branding',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Branding and Digital Presence by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Branding & Digital Presence in Paris, French Riviera & Beirut',
    description:
      'Strategic brand identity, website positioning, and digital presence services for businesses in Paris, the French Riviera, and Beirut.',
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
      name: 'Branding',
      item: 'https://www.dibeh-architecture.com/services/branding',
    },
  ],
}

export default function BrandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BrandingHero />
      <BrandingOverview />
      <BrandingSpecialties />
      <BrandingFAQ />
    </>
  )
}

