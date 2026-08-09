import type { Metadata } from 'next'
import ThreeDScanningHero from '@/components/services/consist-of/3d-scanning/3DScanningHero'
import ThreeDScanningOverview from '@/components/services/consist-of/3d-scanning/3DScanningOverview'
import ThreeDScanningSpecialties from '@/components/services/consist-of/3d-scanning/3DScanningSpecialties'
import ThreeDScanningFAQ from '@/components/services/consist-of/3d-scanning/3DScanningFAQ'

export const metadata: Metadata = {
  title: 'LiDAR 3D Scanning',
  description:
    'LiDAR 3D laser scanning in Paris, the French Riviera (Côte d’Azur), and Beirut. We deliver millimeter-accurate point clouds, as-built surveys, BIM-ready models, and digital twins for architecture, renovation, heritage, and structural documentation projects.',
  alternates: {
    canonical: '/services/3d-scanning',
  },
  openGraph: {
    title: 'LiDAR 3D Scanning | As-Built Surveys & Digital Twins',
    description:
      'Millimeter-accurate LiDAR scanning, point clouds, as-built surveys, and BIM-ready digital twins for renovation, heritage, and architecture projects in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/3d-scanning',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'LiDAR 3D scanning and digital twins by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiDAR 3D Scanning in Paris, French Riviera & Beirut',
    description:
      'LiDAR scanning, point clouds, as-built surveys, and BIM-ready digital twins for projects in Paris, the French Riviera, and Beirut.',
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
      name: '3D Scanning',
      item: 'https://www.dibeh-architecture.com/services/3d-scanning',
    },
  ],
}

export default function ThreeDScanningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ThreeDScanningHero />
      <ThreeDScanningOverview />
      <ThreeDScanningSpecialties />
      <ThreeDScanningFAQ />
    </>
  )
}

