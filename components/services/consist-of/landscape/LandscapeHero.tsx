'use client'

import styles from './LandscapeHero.module.css'

export default function LandscapeHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Landscape Architecture</span>
            </div>
            
            <h1 className={styles.title}>
              Landscape Architecture: Creating Harmony Between Nature & Architecture
            </h1>
            
            <p className={styles.subtitle}>
              Outdoor Living • Biodiversity • Modern Aesthetic
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                A building's value is intrinsically linked to its surroundings. Our landscape services ensure 
                your property feels <strong>cohesive from the inside out</strong>. We design outdoor living spaces 
                that act as extensions of the home—<strong>patios, pool areas, and gardens</strong> that respect 
                local biodiversity while offering a <strong>modern aesthetic</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

