'use client'

import styles from './PhotographyHero.module.css'

export default function PhotographyHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Architectural Photography</span>
            </div>
            
            <h1 className={styles.title}>
              Professional Photography & Virtual Tours for Real Estate & Hospitality
            </h1>
            
            <p className={styles.subtitle}>
              High-End Imagery • Virtual Tours • SEO Optimization
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                In the digital age, your space is judged by its image. We provide 
                <strong> high-end architectural photography</strong> for Architects, Interior Designers, 
                and Real Estate Professionals. We also offer <strong>Immersive Virtual Tours</strong> for 
                Hotels, Restaurants, and Airbnbs, significantly boosting your <strong>SEO and conversion rates</strong> 
                on booking platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

