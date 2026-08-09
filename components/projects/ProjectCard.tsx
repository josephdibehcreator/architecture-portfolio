'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/services/projects'
import styles from './ProjectCard.module.css'

type ProjectCardVariant = 'grid' | 'carousel'

interface ProjectCardProps {
  project: Project
  variant?: ProjectCardVariant
  wrapperClassName?: string
  onSelect?: () => void
  asLink?: boolean
}

export default function ProjectCard({
  project,
  variant = 'grid',
  wrapperClassName,
  onSelect,
}: ProjectCardProps) {
  const imageUrl =
    project.coverImage || (project.images && project.images.length > 0 ? project.images[0] : '')

  const category = project.category || `${project.tag}${project.year ? ` • ${project.year}` : ''}`

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`${styles.projectCard} hover-trigger${wrapperClassName ? ` ${wrapperClassName}` : ''}`}
      onClick={() => onSelect?.()}
      aria-label={project.title}
      data-variant={variant}
    >
      <div className={`${styles.card} hover-trigger`}>
        <div className={`${styles.corner} ${styles.cornerTopLeft}`}></div>
        <div className={`${styles.corner} ${styles.cornerTopRight}`}></div>
        <div className={`${styles.corner} ${styles.cornerBottomLeft}`}></div>
        <div className={`${styles.corner} ${styles.cornerBottomRight}`}></div>

        {imageUrl && (
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 440px"
            />
            <div className={styles.imageOverlay}></div>
            {project.year && (
              <div className={styles.yearBadge}>
                <span>{project.year}</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <span className={styles.category}>{category}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </div>
          </div>
          {project.description && <p className={styles.projectDescription}>{project.description}</p>}
        </div>
      </div>
    </Link>
  )
}

