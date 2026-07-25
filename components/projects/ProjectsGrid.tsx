'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type Project } from '@/services/projects'
import styles from './ProjectsGrid.module.css'

interface ProjectsGridProps {
  initialProjects?: Project[]
}

export default function ProjectsGrid({ initialProjects = [] }: ProjectsGridProps) {
  const router = useRouter()

  if (initialProjects.length === 0) {
    return (
      <section className={styles.projects}>
        <div className="container-fluid">
          <div className={styles.empty}>
            <p>No projects available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.projects}>
      <div className="container-fluid">
        <div className={styles.gridContainer} id="projects-scroll">
          {initialProjects.map((project) => {
            const imageUrl =
              project.coverImage || (project.images && project.images.length > 0 ? project.images[0] : '')
            const category = project.category || `${project.tag}${project.year ? ` • ${project.year}` : ''}`
            return (
              <div
                key={project._id}
                className={`${styles.projectCard} hover-trigger`}
                onClick={() => {
                  router.push(`/projects/${project.slug}`)
                }}
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
                    {project.description && (
                      <p className={styles.projectDescription}>{project.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}