import type { Metadata } from 'next'
import AboutIntro from '@/components/about/AboutIntro'
import MissionVision from '@/components/about/MissionVision'
import FounderQuote from '@/components/about/FounderQuote'
import InquirySection from '@/components/home/InquirySection'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Discover Dibeh Architecture, a design practice based in Paris, the French Riviera (Côte d’Azur), and Beirut. We create refined architectural, interior, and spatial experiences shaped by precision, emotion, and timeless design.',
  alternates: {
    canonical: '/about',
  
  },
  openGraph: {
    title: 'About Dibeh Architecture | Paris, French Riviera & Beirut',
    description:
      'An architecture studio rooted in precision, emotion, and timeless design, serving clients across Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/about',
    siteName: 'Dibeh Architecture',
    type: 'article',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'About Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dibeh Architecture | Paris, French Riviera & Beirut',
    description:
      'Discover the philosophy, mission, and vision behind Dibeh Architecture in Paris, the French Riviera, and Beirut.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <MissionVision />
      <FounderQuote />
      <InquirySection />
    </>
  )
}

