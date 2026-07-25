'use client'

import { X } from 'lucide-react'
import { type Project } from '@/services/projects'
import styles from './ProjectInfoModal.module.css'

interface ProjectInfoModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectInfoModal({ project, isOpen, onClose }: ProjectInfoModalProps) {
  if (!isOpen || !project) return null

  const info = project.info

  return (
    <div className={styles.infoModalOverlay} onClick={onClose}>
      <div className={styles.infoModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalCorner} data-position="top-left"></div>
        <div className={styles.modalCorner} data-position="top-right"></div>
        <div className={styles.modalCorner} data-position="bottom-left"></div>
        <div className={styles.modalCorner} data-position="bottom-right"></div>

        <button
          className={styles.infoModalClose}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className={styles.infoModalHeader}>
          <h2 className={styles.infoModalTitle}>{project.title || ''}</h2>
        </div>

        {info && (
          <>
            <div className={styles.infoModalBody}>
              {info.maitreDouverage && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Maître d'ouvrage</span>
                  <span className={styles.infoValue}>{info.maitreDouverage}</span>
                </div>
              )}
              {info.maitreDoeuvre && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Maître d'œuvre</span>
                  <span className={styles.infoValue}>{info.maitreDoeuvre}</span>
                </div>
              )}
              {info.ingenieurs && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ingénieurs</span>
                  <span className={styles.infoValue}>{info.ingenieurs}</span>
                </div>
              )}
              {info.surface && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Surface</span>
                  <span className={styles.infoValue}>{info.surface}</span>
                </div>
              )}
              {info.programme && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Programme</span>
                  <span className={styles.infoValue}>{info.programme}</span>
                </div>
              )}
              {info.budget && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Budget</span>
                  <span className={styles.infoValue}>{info.budget}</span>
                </div>
              )}
              {info.statut && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Statut</span>
                  <span className={styles.infoValue}>{info.statut}</span>
                </div>
              )}
            </div>

            {info.fullDescription && (
              <div className={styles.infoModalDescription}>
                <h3 className={styles.descriptionTitle}>DESCRIPTION</h3>
                <p className={styles.descriptionText}>{info.fullDescription}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

