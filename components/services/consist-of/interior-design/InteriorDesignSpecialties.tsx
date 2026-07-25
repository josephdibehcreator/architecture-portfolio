'use client'

import { Box, Lightbulb, ShoppingBag } from 'lucide-react'
import styles from './InteriorDesignSpecialties.module.css'

const specialties = [
  {
    icon: Box,
    title: 'Custom Cabinetry',
    description: 'Unique storage and kitchen solutions tailored to your space. We design and specify custom cabinetry that maximizes functionality while maintaining aesthetic coherence with the overall design.',
    scope: 'Storage & Kitchen Solutions',
  },
  {
    icon: Lightbulb,
    title: 'Lighting Design',
    description: 'Creating atmosphere through technical and decorative lighting. We develop comprehensive lighting strategies that enhance mood, functionality, and architectural features.',
    scope: 'Technical & Decorative',
  },
  {
    icon: ShoppingBag,
    title: 'FF&E Selection',
    description: 'Curating furniture, fixtures, and equipment for a turnkey result. We source and specify every element to ensure cohesive design and quality execution.',
    scope: 'Furniture & Fixtures',
  },
]

export default function InteriorDesignSpecialties() {
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

