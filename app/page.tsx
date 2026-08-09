import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CompanyStatsSection from '@/components/home/CompanyStatsSection'
import ServicesList from '@/components/services/ServicesList'
import ProjectsSection from '@/components/home/ProjectsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CareerSection from '@/components/home/CareerSection'
import InquirySection from '@/components/home/InquirySection'
import { getProjects, type Project } from '@/services/projects'
import { getTestimonials, type Testimonial } from '@/services/testimonials'
import { getHomepageStats, type HomepageStatsData } from '@/services/homepageStats'
import { getJobs, type Job } from '@/services/jobs'
import styles from '../styles/home-page/page.module.css'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

export const metadata: Metadata = {
  // No `title` here on purpose: the homepage inherits the branded default from
  // app/layout.tsx ("Dibeh Architecture | Paris, French Riviera & Beirut").
  description:
    'Dibeh Architecture delivers high-end architecture, interior design, landscape, permits, 3D printing, and digital branding services in Paris, the French Riviera (Côte d’Azur), and Beirut.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Architecture Studio in Paris, French Riviera & Beirut | Dibeh Architecture',
    description:
      'Architecture, interior design, landscape, permits, architectural visualization, and 3D printing for projects in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    url: 'https://www.dibeh-architecture.com',
    siteName: 'Dibeh Architecture',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Dibeh Architecture in Paris, French Riviera and Beirut',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture Studio in Paris, French Riviera & Beirut | Dibeh Architecture',
    description:
      'High-end architecture, interiors, landscape, permits, and 3D printing in Paris, the French Riviera (Côte d’Azur), and Beirut.',
    images: [
      'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
    ],
  },
}

export default async function Home() {
  let initialProjects: Project[] = []
  let initialTestimonials: Testimonial[] = []
  let initialStats = null
  let initialJobs: Job[] = []

  try {
    const [projectsResponse, testimonialsResponse, statsResponse, jobsResponse] = await Promise.all([
      getProjects({ sort: 'createdAt', order: 'desc' }, ISR_FETCH_OPTIONS),
      getTestimonials(ISR_FETCH_OPTIONS),
      getHomepageStats(ISR_FETCH_OPTIONS),
      getJobs(ISR_FETCH_OPTIONS),
    ])

    if (projectsResponse.success && Array.isArray(projectsResponse.data)) {
      initialProjects = projectsResponse.data.slice(0, 20)
    }
    if (testimonialsResponse.success && Array.isArray(testimonialsResponse.data)) {
      initialTestimonials = testimonialsResponse.data
    }
    if (statsResponse.success && statsResponse.data) {
      initialStats = statsResponse.data
    }
    if (jobsResponse.success && Array.isArray(jobsResponse.data)) {
      initialJobs = jobsResponse.data
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  return (
    <div className={styles.homePage}>
      <HeroSection />
      <CompanyStatsSection initialStats={initialStats} />
      <ServicesList showLink={true} linkHref="/services" sectionNumber={2} />
      <ProjectsSection sectionNumber={3} initialProjects={initialProjects} />
      <TestimonialsSection sectionNumber={4} initialTestimonials={initialTestimonials} />
      <CareerSection sectionNumber={5} initialJobs={initialJobs} />
      <InquirySection sectionNumber={6} />
    </div>
  )
}

