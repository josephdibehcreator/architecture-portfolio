'use client'

import { Building2, Maximize2, Palette } from 'lucide-react'
import styles from './ArchitectureSpecialties.module.css'

const specialties = [
  {
    icon: Building2,
    title: 'Home Extensions',
    description: 'Expert design for house extensions up to 40m² in U-zones, maximizing your living space while respecting local regulations.',
    scope: 'Up to 40m² in U-zones',
  },
  {
    icon: Maximize2,
    title: 'Roof Elevations',
    description: 'Transform your attic into functional living space through strategic roof modifications and structural planning.',
    scope: 'Full height optimization',
  },
  {
    icon: Palette,
    title: 'Facade Changes',
    description: 'Comprehensive facade redesign and modernization, handling all aspects of the Déclaration Préalable process.',
    scope: 'Exterior transformation',
  },
]

export default function ArchitectureSpecialties() {
  return (
    <section className={styles.specialties}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>02. Specializations</span>
            <h2 className={styles.title}>What We Do Best</h2>
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
