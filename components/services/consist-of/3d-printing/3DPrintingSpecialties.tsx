'use client'

import { Ruler, TestTube, Hand } from 'lucide-react'
import styles from './3DPrintingSpecialties.module.css'

const specialties = [
  {
    icon: Ruler,
    title: 'Scale Models',
    description: 'Precise 1:50, 1:100, or 1:200 architectural models. We create accurate scale representations that help visualize proportions, spatial relationships, and design details at various scales depending on your project needs.',
    scope: '1:50, 1:100, 1:200',
  },
  {
    icon: TestTube,
    title: 'Design Verification',
    description: 'Test complex geometries before they go to construction. Physical models allow you to identify potential issues, verify proportions, and validate design decisions in three dimensions before committing to construction.',
    scope: 'Prototyping & Testing',
  },
  {
    icon: Hand,
    title: 'Presentation Tools',
    description: 'Enhance your client meetings with a tactile representation of the project. Physical models create powerful visual impact, helping clients and stakeholders understand and connect with your design on an intuitive level.',
    scope: 'Client Presentations',
  },
]

export default function ThreeDPrintingSpecialties() {
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

