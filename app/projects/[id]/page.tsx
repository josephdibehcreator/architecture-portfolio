import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectViewer from '@/components/projects/viewer/ProjectViewer'
import { getProjects, getProjectBySlug } from '@/services/projects'

const ISR_FETCH_OPTIONS = {
  next: { revalidate: 3600 },
  withCredentials: false,
} as const

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const response = await getProjects({}, ISR_FETCH_OPTIONS)

    if (!response.success || !Array.isArray(response.data)) {
      console.error(
        '[generateStaticParams] Failed to fetch projects:',
        response.message ?? 'Unknown error'
      )
      return []
    }

    return response.data
      .filter((project) => project.status === 'published' && project.slug)
      .map((project) => ({ id: project.slug }))
  } catch (error) {
    console.error('[generateStaticParams] Error fetching projects:', error)
    return []
  }
}

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = params
  // Here `id` is actually the public project slug
  const response = await getProjectBySlug(id, ISR_FETCH_OPTIONS)

  if (!response.success || !response.data) {
    return {
      title: 'Project not found',
      description: 'The requested project could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const project = response.data

  const image =
    project.coverImage ||
    (Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : undefined)

  const canonicalPath = `/projects/${id}`
  const canonicalUrl = `https://www.dibeh-architecture.com${canonicalPath}`

  return {
    title: project.title || 'Project',
    description:
      project.description ||
      `A portfolio project by Dibeh Architecture in Paris, the French Riviera (Côte d’Azur), and Beirut.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: project.title || 'Project',
      description:
        project.description ||
        `A portfolio project by Dibeh Architecture in Paris, the French Riviera (Côte d’Azur), and Beirut.`,
      url: canonicalUrl,
      siteName: 'Dibeh Architecture',
      type: 'article',
      images: image
        ? [
            {
              url: image,
              alt: project.title || 'Project',
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title || 'Project',
      description:
        project.description ||
        `A portfolio project by Dibeh Architecture in Paris, the French Riviera (Côte d’Azur), and Beirut.`,
      images: image ? [image] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params
  // Treat the dynamic segment as the slug, since the public API is slug-based
  const response = await getProjectBySlug(id, ISR_FETCH_OPTIONS)

  if (!response.success || !response.data) {
    notFound()
  }

  const project = response.data

  const image =
    project.coverImage ||
    (Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : undefined)

  const canonicalPath = `/projects/${id}`
  const canonicalUrl = `https://www.dibeh-architecture.com${canonicalPath}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title || 'Project',
    description:
      project.description ||
      'Architecture, interior design, and spatial design project by Dibeh Architecture.',
    url: canonicalUrl,
    image: image || undefined,
    mainEntityOfPage: canonicalUrl,
    keywords: [
      project.tag ? `${project.tag} architecture` : undefined,
      project.category || undefined,
      project.year || undefined,
      project.title,
    ]
      .filter(Boolean)
      .join(', '),
    about: [project.category, project.tag].filter(Boolean),
    areaServed: [
      {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Paris',
          addressCountry: 'FR',
        },
      },
      {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'French Riviera',
          addressRegion: 'Côte d’Azur',
          addressCountry: 'FR',
        },
      },
      {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Beirut',
          addressCountry: 'LB',
        },
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Dibeh Architecture',
      logo: {
        '@type': 'ImageObject',
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Server component renders this for crawlers; safe to inline JSON for SEO.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProjectViewer project={project} />
    </>
  )
}
