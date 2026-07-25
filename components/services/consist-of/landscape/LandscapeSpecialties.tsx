'use client'

import { Square, Sprout, Merge } from 'lucide-react'
import styles from './LandscapeSpecialties.module.css'

const specialties = [
  {
    icon: Square,
    title: 'Hardscaping',
    description: 'Design of terraces, pathways, and retaining walls. We create structural outdoor elements that define spaces, manage terrain, and provide functional surfaces for outdoor living.',
    scope: 'Terraces & Pathways',
  },
  {
    icon: Sprout,
    title: 'Softscaping',
    description: 'Selection of native plants and sustainable irrigation. We design planting schemes that thrive in local conditions while creating beautiful, low-maintenance landscapes.',
    scope: 'Native Plants & Irrigation',
  },
  {
    icon: Merge,
    title: 'Outdoor Integration',
    description: 'Seamlessly blending the architecture with the natural terrain. We ensure your outdoor spaces feel like a natural extension of your home, creating cohesive indoor-outdoor living experiences.',
    scope: 'Architecture & Nature',
  },
]

export default function LandscapeSpecialties() {
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

