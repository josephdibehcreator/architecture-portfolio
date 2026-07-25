'use client'

import styles from './ArchitectureHero.module.css'

export default function ArchitectureHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Architecture</span>
            </div>
            
            <h1 className={styles.title}>
              Architectural Concept Design & Extension Specialists
            </h1>
            
            <p className={styles.subtitle}>
              Up to 150m² | Déclaration Préalable Experts
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                Navigating the French architectural landscape requires a specialized approach. 
                We focus our core architectural services on projects within the <strong>150m² floor area limit</strong>, 
                specifically mastering the <strong>Déclaration Préalable (DP)</strong> process for house extensions, 
                garage conversions, and renovations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
