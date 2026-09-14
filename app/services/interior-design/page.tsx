import type { Metadata } from 'next'
import InteriorDesignHero from '@/components/services/consist-of/interior-design/InteriorDesignHero'
import InteriorDesignOverview from '@/components/services/consist-of/interior-design/InteriorDesignOverview'
import InteriorDesignSpecialties from '@/components/services/consist-of/interior-design/InteriorDesignSpecialties'
import InteriorDesignFAQ from '@/components/services/consist-of/interior-design/InteriorDesignFAQ'
import { getSiteUrl } from '@/utils/site'

export const metadata: Metadata = {
  title: 'Interior Design Services',
  description:
    'Interior design services in Paris, the French Riviera (Côte d’Azur), and Beirut for residential, hospitality, retail, and commercial spaces. We create bespoke interiors through spatial optimization, custom cabinetry, lighting design, and curated FF&E selection.',
  alternates: {
    canonical: '/services/interior-design',
  
    
  },
  openGraph: {
    title: 'Interior Design Services | Bespoke Interiors & Spatial Optimization',
    description:
      'High-end interior design for residential and commercial spaces in Paris, the French Riviera (Côte d’Azur), and Beirut, including custom cabinetry, lighting design, and FF&E selection.',
    url: '/services/interior-design',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Interior Design Services by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Design Services in Paris, French Riviera & Beirut',
    description:
      'Bespoke interiors, custom cabinetry, lighting design, and FF&E selection for residential and commercial projects.',
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
      name: 'Interior Design',
      item: `${getSiteUrl()}/services/interior-design`,
    },
  ],
}

export default function InteriorDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <InteriorDesignHero />
      <InteriorDesignOverview />
      <InteriorDesignSpecialties />
      <InteriorDesignFAQ />
    </>
  )
}

