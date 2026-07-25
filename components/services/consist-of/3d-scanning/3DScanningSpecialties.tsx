'use client'

import { Ruler, Layers, Video } from 'lucide-react'
import styles from './3DScanningSpecialties.module.css'

const specialties = [
  {
    icon: Ruler,
    title: 'As-Built Surveys',
    description: 'High-speed scanning for renovation and heritage projects. We capture existing conditions with millimeter precision, providing the accurate foundation needed for design and construction planning.',
    scope: 'Renovation & Heritage',
  },
  {
    icon: Layers,
    title: 'Digital Twins',
    description: 'A permanent, accurate 3D record of your property. These digital replicas serve as valuable documentation for future renovations, insurance purposes, and property management.',
    scope: '3D Documentation',
  },
  {
    icon: Video,
    title: 'Virtual Walkthroughs',
    description: 'Perfect for showcasing projects to stakeholders or remote clients. Our immersive 360-degree virtual tours allow anyone to explore spaces from anywhere in the world.',
    scope: 'Remote Exploration',
  },
]

export default function ThreeDScanningSpecialties() {
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

