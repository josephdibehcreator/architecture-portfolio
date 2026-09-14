import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectViewer from '@/components/projects/viewer/ProjectViewer'
import { getProjects, getProjectBySlug } from '@/services/projects'
import { getSiteUrl } from '@/utils/site'

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
  const canonicalUrl = `${getSiteUrl()}${canonicalPath}`

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
  const canonicalUrl = `${getSiteUrl()}${canonicalPath}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title || 'Project',
    description:
      project.description ||
      'Architecture, interior design, and spatial design project by Dibeh Architecture.',
    url: canonicalUrl,
    image: image || undefined,
    inLanguage: 'en',
    datePublished: project.createdAt || undefined,
    dateCreated: project.createdAt || undefined,
    dateModified: project.updatedAt || project.createdAt || undefined,
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${getSiteUrl()}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: canonicalUrl },
    ],
  }

  const info = project.info
  const infoRows: Array<[string, string | undefined]> = [
    ["Maître d'ouvrage", info?.maitreDouverage],
    ["Maître d'œuvre", info?.maitreDoeuvre],
    ['Ingénieurs', info?.ingenieurs],
    ['Surface', info?.surface],
    ['Programme', info?.programme],
    ['Budget', info?.budget],
    ['Statut', info?.statut],
  ]
  const visibleInfoRows = infoRows.filter(([, value]) => Boolean(value))

  return (
    <>
      <script
        type="application/ld+json"
        // Server component renders this for crawlers; safe to inline JSON for SEO.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectViewer project={project} />

      {/*
        The interactive viewer keeps project details behind a modal, so this block
        renders the same content in the initial HTML for crawlers and screen readers.
        `visually-hidden` comes from Bootstrap, which is imported globally in app/layout.tsx.
      */}
      {(visibleInfoRows.length > 0 || info?.fullDescription) && (
        <section className="visually-hidden">
          <h2>{`${project.title} — project details`}</h2>

          {visibleInfoRows.length > 0 && (
            <dl>
              {visibleInfoRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {info?.fullDescription && (
            <>
              <h3>Description</h3>
              <p>{info.fullDescription}</p>
            </>
          )}
        </section>
      )}
    </>
  )
}
