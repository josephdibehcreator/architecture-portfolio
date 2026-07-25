'use client'

import { Brush, Globe, TrendingUp, Coffee } from 'lucide-react'
import styles from './BrandingSpecialties.module.css'

const specialties = [
  {
    icon: Brush,
    title: 'Visual Identity & Graphic Design',
    description: 'Professional logo design, curated color palettes, and typography that define your brand\'s "atmosphere." We create cohesive visual systems that communicate your brand\'s personality and values across all applications.',
    scope: 'Logo & Identity',
  },
  {
    icon: Globe,
    title: 'SEO-Optimized Web Strategy',
    description: 'We build portfolio and commerce-driven websites that don\'t just look good but are engineered to rank on Google and convert visitors into clients. Our web strategies combine beautiful design with technical excellence.',
    scope: 'Web & SEO',
  },
  {
    icon: TrendingUp,
    title: 'Brand Positioning',
    description: 'We help you define your "Why." We analyze your market competition to position your business as a leader in your specific niche. Strategic positioning ensures your brand stands out and attracts the right audience.',
    scope: 'Market Strategy',
  },
  {
    icon: Coffee,
    title: 'Hospitality & Retail Focus',
    description: 'Specialized branding for hotels, restaurants, and shops, ensuring your physical space and digital brand speak the same language. We create seamless brand experiences that connect online and offline touchpoints.',
    scope: 'Hospitality & Retail',
  },
]

export default function BrandingSpecialties() {
  return (
    <section className={styles.specialties}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>02. Our Creative Ecosystem</span>
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

