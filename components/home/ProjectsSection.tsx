'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { type Project } from '@/services/projects'
import ProjectCard from '../projects/ProjectCard'
import styles from './ProjectsSection.module.css'

interface ProjectsSectionProps {
  sectionNumber?: number
  initialProjects: Project[]
}

export default function ProjectsSection({
  sectionNumber,
  initialProjects,
}: ProjectsSectionProps) {
  const { t } = useLanguage()
  const [projects] = useState<Project[]>(initialProjects)
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    if (projects.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }
  }

  const prevSlide = () => {
    if (projects.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    }
  }

  useEffect(() => {
    if (projects.length > 0) {
      autoPlayIntervalRef.current = setInterval(() => {
        nextSlide()
      }, 4000)
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
    }
  }, [projects.length])

  const getCardPosition = (index: number) => {
    const diff = (index - currentIndex + projects.length) % projects.length
    if (diff === 0) return 'center' // Present card
    if (diff === 1) return 'right' // Upcoming card (next to come from right)
    return 'left' // Passed card (previous goes to left)
  }

  return (
    <section className={styles.projects} id="projects">
      <div className="container-fluid">
        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              {sectionNumber !== undefined
                ? `${sectionNumber.toString().padStart(2, '0')}. ${t('projects_label')}`
                : t('projects_label')}
            </span>
            <h2 className={styles.title}>
              <Link href="/projects" className="hover-trigger">
                {t('projects_title')}
              </Link>
            </h2>
          </div>
          <div className={styles.controls}>
            <button
              className={`${styles.controlBtn} hover-trigger`}
              onClick={prevSlide}
              aria-label="Previous project"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className={`${styles.controlBtn} hover-trigger`}
              onClick={nextSlide}
              aria-label="Next project"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className={styles.empty}>
            <p>No projects available</p>
          </div>
        ) : (
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
              {projects.map((project, index) => {
                const position = getCardPosition(index)
                const positionClass =
                  styles[`card${position.charAt(0).toUpperCase() + position.slice(1)}`]

                return (
                  <div
                    key={project._id}
                    className={`${styles.projectCard} ${positionClass}`}
                  >
                    <ProjectCard
                      project={project}
                      onSelect={() => goToSlide(index)}
                      variant="carousel"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

