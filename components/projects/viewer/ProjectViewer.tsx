'use client'

import { useRouter } from 'next/navigation'
import {
  Info,
  ArrowRight as ArrowRightIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  X,
} from 'lucide-react'
import { type Project } from '@/services/projects'
import styles from './ProjectViewer.module.css'
import ProjectSlideshow from './ProjectSlideshow'
import ProjectInfoModal from './ProjectInfoModal'
import ProjectPlansModal from './ProjectPlansModal'
import ProjectGalleryModal from './ProjectGalleryModal'
import { useState } from 'react'

interface ProjectViewerProps {
  project: Project
}

export default function ProjectViewer({ project }: ProjectViewerProps) {
  const router = useRouter()
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryStartIndex, setGalleryStartIndex] = useState<number | undefined>(undefined)

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/projects#projects-scroll')
    }
  }

  const hasPlans = project.tag !== 'Residential' && Array.isArray(project.plans) && project.plans.length > 0

  return (
    <>
      <ProjectSlideshow images={project.images} title={project.title}>
        {({ hasImages: slideshowHasImages, next, prev, progress, currentIndex }) => (
          <div className={styles.viewerContent}>
            <button
              className={styles.viewerClose}
              onClick={handleClose}
              aria-label="Close viewer"
            >
              <X size={24} strokeWidth={2} />
            </button>

            <div className={`${styles.viewerInfo} ${styles.viewerInfoVisible}`}>
              <div className={styles.viewerTags}>
                {project.tag && <span className={styles.viewerTag}>{project.tag}</span>}
                {project.year && <span className={styles.viewerYear}>{project.year}</span>}
              </div>

              <h1 className={styles.viewerTitle}>{project.title}</h1>

              <div className={styles.viewerActions}>
                {project.description && (
                  <p className={styles.viewerDescription}>{project.description}</p>
                )}
                <div className={styles.viewerButtons}>
                  {hasPlans && (
                    <button
                      className={`${styles.viewPlansBtn} hover-trigger`}
                      onClick={() => setIsPlansModalOpen(true)}
                    >
                      View Plans
                      <ArrowRightIcon size={16} strokeWidth={2} />
                    </button>
                  )}
                  <button
                    className={`${styles.infoBtn} hover-trigger`}
                    onClick={() => setIsInfoModalOpen(true)}
                    aria-label="Project information"
                  >
                    <Info size={20} strokeWidth={2} />
                  </button>
                  {slideshowHasImages && (
                    <>
                      <button
                        className={`${styles.slideNavBtn} hover-trigger`}
                        onClick={() => {
                          setGalleryStartIndex(currentIndex)
                          setIsGalleryOpen(true)
                        }}
                        aria-label="Open image gallery"
                      >
                        <LayoutGrid size={20} strokeWidth={2} />
                      </button>
                      <button
                        className={`${styles.slideNavBtn} hover-trigger`}
                        onClick={prev}
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} strokeWidth={2} />
                      </button>
                      <button
                        className={`${styles.slideNavBtn} hover-trigger`}
                        onClick={next}
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </ProjectSlideshow>

      <ProjectInfoModal
        project={project}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <ProjectPlansModal
        title={project.title}
        plans={project.plans}
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
      />

      <ProjectGalleryModal
        isOpen={isGalleryOpen}
        images={project.images}
        title={project.title}
        initialIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  )
}

