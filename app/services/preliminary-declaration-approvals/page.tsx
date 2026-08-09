import PermitsHero from '@/components/services/consist-of/permits/PermitsHero'
import PermitsOverview from '@/components/services/consist-of/permits/PermitsOverview'
import PermitsSpecialties from '@/components/services/consist-of/permits/PermitsSpecialties'
import PermitsFAQ from '@/components/services/consist-of/permits/PermitsFAQ'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preliminary Declaration & Approvals',
  description:
    'Preliminary declaration and planning approval services in Paris, the French Riviera (Côte d’Azur), and Beirut, including facade approvals, extension approvals, PLU compliance, and heritage-zone submissions.',
  alternates: {
    canonical: '/services/preliminary-declaration-approvals',
  },
  openGraph: {
    title: 'Preliminary Declaration & Approvals | PLU Compliance and Heritage Submissions',
    description:
      'Specialized support for declaration prealable files, planning approvals, PLU compliance, and ABF or heritage-zone approvals in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/services/preliminary-declaration-approvals',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Preliminary Declaration and Approvals by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preliminary Declaration & Approvals in Paris, French Riviera and Beirut',
    description:
      'Declaration prealable, planning approvals, PLU compliance, and approval dossiers for architecture projects in Paris, the French Riviera, and Beirut.',
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
      name: 'Preliminary Declaration & Approvals',
      item: 'https://www.dibeh-architecture.com/services/preliminary-declaration-approvals',
    },
  ],
}

export default function PreliminaryDeclarationApprovalsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PermitsHero />
      <PermitsOverview />
      <PermitsSpecialties />
      <PermitsFAQ />
    </>
  )
}
