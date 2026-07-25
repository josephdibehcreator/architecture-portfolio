'use client'

import { Home, UtensilsCrossed, Building2 } from 'lucide-react'
import styles from './PhotographySpecialties.module.css'

const specialties = [
  {
    icon: Home,
    title: 'Real Estate & Airbnb',
    description: 'Bright, wide-angle imagery that drives bookings. We capture properties in their best light, showcasing space, natural light, and key features that attract potential buyers and renters.',
    scope: 'Property Photography',
  },
  {
    icon: UtensilsCrossed,
    title: 'Hospitality Tours',
    description: '3D walkthroughs for restaurants and hotels to build guest trust. Our immersive virtual tours allow potential guests to explore spaces before booking, increasing confidence and conversion rates.',
    scope: 'Hotels & Restaurants',
  },
  {
    icon: Building2,
    title: 'Commercial Agencies',
    description: 'Showcase retail spaces and office portfolios with professional clarity. We create compelling visual content that helps commercial real estate professionals market properties effectively.',
    scope: 'Retail & Office Spaces',
  },
]

export default function PhotographySpecialties() {
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

