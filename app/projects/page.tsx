import type { Metadata } from 'next'
import ProjectsHeader from '@/components/projects/ProjectsHeader'
import ProjectsGrid from '@/components/projects/ProjectsGrid'
import Pagination from '@/components/shared/Pagination'
import InquirySection from '@/components/home/InquirySection'
import { getProjectsPaginated, type Project } from '@/services/projects'
import { fetchPageWithClamp, parsePageParam } from '@/services/pagination'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

const PROJECTS_PER_PAGE = 9

type ProjectsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: ProjectsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const page = parsePageParam(resolvedSearchParams.page)

  return {
    title: 'Projects',
    description:
      'Explore selected architecture and interior design projects by Dibeh Architecture in Paris, the French Riviera (Côte d’Azur), and Beirut, including residential, hospitality, Airbnb, and commercial spaces.',
    alternates: {
      // Self-referencing canonical on paginated pages so ?page=2+ stays indexable
      canonical: page > 1 ? `/projects?page=${page}` : '/projects',

    },
    openGraph: {
      title: 'Projects | Dibeh Architecture',
      description:
        'Selected architecture and interior design projects across residential, hospitality, Airbnb, and commercial spaces in Paris, the French Riviera (Côte d’Azur), and Beirut.',
      url: '/projects',
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
}


export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams
  const requestedPage = parsePageParam(resolvedSearchParams.page)

  let projects: Project[] = []
  let currentPage = requestedPage
  let totalPages = 1

  try {
    const result = await fetchPageWithClamp(
      (page) =>
        getProjectsPaginated(
          { page, limit: PROJECTS_PER_PAGE, sort: 'createdAt', order: 'desc' },
          ISR_FETCH_OPTIONS
        ),
      requestedPage
    )
    projects = result.items
    currentPage = result.page
    totalPages = result.totalPages
  } catch (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <>
      <ProjectsHeader />
      <ProjectsGrid initialProjects={projects} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/projects"
        pageParam="page"
        searchParams={resolvedSearchParams}
        scrollTargetId="projects-scroll"
      />
      <InquirySection />
    </>
  )
}
