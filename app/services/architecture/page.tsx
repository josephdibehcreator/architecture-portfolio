import type { Metadata } from 'next'
import ArchitectureHero from '@/components/services/consist-of/architecture/ArchitectureHero'
import ArchitectureOverview from '@/components/services/consist-of/architecture/ArchitectureOverview'
import ArchitectureSpecialties from '@/components/services/consist-of/architecture/ArchitectureSpecialties'
import ArchitectureProcess from '@/components/services/consist-of/architecture/ArchitectureProcess'
import ArchitectureFAQ from '@/components/services/consist-of/architecture/ArchitectureFAQ'

export const metadata: Metadata = {
  title: 'Architecture Services',
  description:
    'Architectural services in Paris, the French Riviera (Côte d’Azur), and Beirut for home extensions, renovations, facade modifications, roof elevations, and concept design. Expert support for Déclaration Préalable projects and tailored architectural planning.',
  alternates: {
    canonical: '/services/architecture',
   
  },
  openGraph: {
    title: 'Architecture Services | Extensions, Renovations & Concept Design',
    description:
      'Tailored architectural services for extensions, renovations, facade changes, and concept design in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/architecture',
    siteName: 'Dibeh Architecture',
    type: 'article',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Architecture Services by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture Services in Paris, French Riviera & Beirut',
    description:
      'Expert architecture for extensions, facade changes, renovations, and concept design across Paris, the French Riviera, and Beirut.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

export default function ArchitecturePage() {
  return (
    <>
      <ArchitectureHero />
      <ArchitectureOverview />
      <ArchitectureSpecialties />
      <ArchitectureProcess />
      <ArchitectureFAQ />
    </>
  )
}
