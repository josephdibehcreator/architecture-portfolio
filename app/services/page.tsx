import type { Metadata } from 'next'
import ServicesHeader from '@/components/services/ServicesHeader'
import ServicesList from '@/components/services/ServicesList'
import Methodology from '@/components/services/Methodology'
import InquirySection from '@/components/home/InquirySection'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore Dibeh Architecture services in Paris, the French Riviera (Côte d’Azur), and Beirut: architecture, interior design, landscape, permits, architectural photography, 3D printing, 3D scanning, and branding.',
  alternates: {
    canonical: '/services',
  
  },
  openGraph: {
    title: 'Architecture & Interior Design Services | Paris, French Riviera & Beirut',
    description:
      'Comprehensive architecture, interior design, landscape, permits, 3D printing, and branding services across Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Dibeh Architecture Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture & Interior Design Services in Paris, French Riviera & Beirut',
    description:
      'Architecture, interiors, landscape, permits, 3D printing, and branding services for projects in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}


export default function ServicesPage() {
  return (
    <>
      <ServicesHeader />
      <ServicesList title="Our Services" showLink={false} sectionNumber={2} />
      <Methodology />
      <InquirySection sectionNumber={4} />
    </>
  )
}

