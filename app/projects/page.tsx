import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import InquirySection from '@/components/home/InquirySection'
import { getProjects, type Project } from '@/services/projects'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore selected architecture and interior design projects by Dibeh Architecture in Paris, the French Riviera (Côte d’Azur), and Beirut, including residential, hospitality, Airbnb, and commercial spaces.',
  alternates: {
    canonical: '/projects',
 
  },
  openGraph: {
    title: 'Projects | Dibeh Architecture',
    description:
      'Selected architecture and interior design projects across residential, hospitality, Airbnb, and commercial spaces in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com/projects',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Projects by Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Dibeh Architecture',
    description:
      'Explore selected architecture and interior design projects in Paris, the French Riviera, Beirut, and beyond.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}


export default async function ProjectsPage() {
  let initialProjects: Project[] = []

  try {
    const response = await getProjects({ sort: 'createdAt', order: 'desc' }, ISR_FETCH_OPTIONS)
    if (response.success && Array.isArray(response.data)) {
      initialProjects = response.data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <>
      <ProjectsHeader />
      <ProjectsGrid initialProjects={initialProjects} />
      <InquirySection />
    </>
  )
}

