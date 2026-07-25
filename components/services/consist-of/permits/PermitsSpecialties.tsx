'use client'

import { FolderOpen, Map, Landmark } from 'lucide-react'
import styles from './PermitsSpecialties.module.css'

const specialties = [
  {
    icon: FolderOpen,
    title: 'Dossier Management',
    description: 'We prepare all Cerfa forms, site plans (PCMI1), and graphic insertions. Our comprehensive dossier management ensures all required documentation is complete, accurate, and submitted on time.',
    scope: 'Complete Documentation',
  },
  {
    icon: Map,
    title: 'PLU Compliance',
    description: 'We ensure your project respects the local Plan Local d\'Urbanisme. Our expertise in local planning regulations guarantees your project meets all zoning requirements and restrictions.',
    scope: 'Local Planning Rules',
  },
  {
    icon: Landmark,
    title: 'Heritage Zones',
    description: 'Specialized experience with Architectes des Bâtiments de France (ABF). We navigate the complexities of protected heritage zones, ensuring your project respects historical context while meeting modern needs.',
    scope: 'ABF Coordination',
  },
]

export default function PermitsSpecialties() {
  return (
    <section className={styles.specialties}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>02. Specializations</span>
          <h2 className={styles.title}>Core Services</h2>
        </div>

        <div className={styles.cardsGrid}>
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon
            return (
              <div key={index} className={styles.cardWrapper}>
                <div className={`${styles.card} hover-trigger`}>
                  <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
                  <div className={`${styles.corner} ${styles.cornerTopRight}`} />
                  <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
                  <div className={`${styles.corner} ${styles.cornerBottomRight}`} />

                  <div className={styles.iconContainer}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>

                  <h3 className={styles.cardTitle}>{specialty.title}</h3>
                  
                  <div className={styles.scope}>
                    <span className={styles.scopeLabel}>{specialty.scope}</span>
                  </div>

                  <p className={styles.cardDescription}>{specialty.description}</p>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}

