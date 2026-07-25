import type { Metadata } from 'next'
import ThreeDPrintingHero from '@/components/services/consist-of/3d-printing/3DPrintingHero'
import ThreeDPrintingOverview from '@/components/services/consist-of/3d-printing/3DPrintingOverview'
import ThreeDPrintingSpecialties from '@/components/services/consist-of/3d-printing/3DPrintingSpecialties'
import ThreeDPrintingFAQ from '@/components/services/consist-of/3d-printing/3DPrintingFAQ'

export const metadata: Metadata = {
  title: 'Architectural 3D Printing',
  description:
    'High-detail architectural 3D printing services in Paris, the French Riviera (Côte d’Azur), and Beirut. We create scale models, maquettes, design prototypes, and presentation-ready physical models for architects, developers, and urban planning teams.',
  alternates: {
    canonical: '/services/3d-printing',
  },
  openGraph: {
    title: 'Architectural 3D Printing | Scale Models, Maquettes & Prototyping',
    description:
      'Transform digital architectural designs into physical scale models for client presentations, design verification, and planning submissions in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/3d-printing',
    siteName: 'Dibeh Architecture',
    type: 'article',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Architectural 3D Printing and Scale Models by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural 3D Printing in Paris, French Riviera & Beirut',
    description:
      'Precision 3D printed maquettes, architectural scale models, and prototypes for presentations and urban planning.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

export default function ThreeDPrintingPage() {
  return (
    <>
      <ThreeDPrintingHero />
      <ThreeDPrintingOverview />
      <ThreeDPrintingSpecialties />
      <ThreeDPrintingFAQ />
    </>
  )
}

