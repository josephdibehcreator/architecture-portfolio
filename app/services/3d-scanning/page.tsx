import type { Metadata } from 'next'
import ThreeDScanningHero from '@/components/services/consist-of/3d-scanning/3DScanningHero'
import ThreeDScanningOverview from '@/components/services/consist-of/3d-scanning/3DScanningOverview'
import ThreeDScanningSpecialties from '@/components/services/consist-of/3d-scanning/3DScanningSpecialties'
import ThreeDScanningFAQ from '@/components/services/consist-of/3d-scanning/3DScanningFAQ'

export const metadata: Metadata = {
  title: '3D Scanning & Virtual Tours',
  description:
    '3D laser scanning and virtual tour services in Paris, the French Riviera (Côte d’Azur), and Beirut. We deliver millimeter-accurate LiDAR scanning, as-built surveys, digital twins, and immersive 360° virtual walkthroughs for architecture, renovation, heritage, and real estate projects.',
  alternates: {
    canonical: '/services/3d-scanning',
  },
  openGraph: {
    title: '3D Scanning & Virtual Tours | LiDAR, As-Built Surveys & Digital Twins',
    description:
      'Millimeter-accurate 3D laser scanning and immersive virtual tours for renovation, heritage, architecture, and real estate projects in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/3d-scanning',
    siteName: 'Dibeh Architecture',
    type: 'article',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: '3D Scanning and Virtual Tours by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Scanning & Virtual Tours in Paris, French Riviera & Beirut',
    description:
      'LiDAR scanning, as-built surveys, digital twins, and immersive 360° virtual tours for projects in Paris, the French Riviera, and Beirut.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}


export default function ThreeDScanningPage() {
  return (
    <>
      <ThreeDScanningHero />
      <ThreeDScanningOverview />
      <ThreeDScanningSpecialties />
      <ThreeDScanningFAQ />
    </>
  )
}

