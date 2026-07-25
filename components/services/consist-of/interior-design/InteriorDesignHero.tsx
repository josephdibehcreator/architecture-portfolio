'use client'

import styles from './InteriorDesignHero.module.css'

export default function InteriorDesignHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Interior Design</span>
            </div>
            
            <h1 className={styles.title}>
              Bespoke Interior Design: Tailored Environments & Spatial Optimization
            </h1>
            
            <p className={styles.subtitle}>
              High-End Materiality • Custom Solutions • Ergonomic Flow
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                Interior design is the bridge between a building's shell and the daily experience of its inhabitants. 
                We specialize in transforming architectural concepts into lived realities. Our approach focuses on 
                <strong> high-end materiality</strong>, <strong>custom cabinetry</strong>, and <strong>ergonomic flow</strong>. 
                Whether we are continuing a project from our own APS/APD architectural phase or starting fresh with an existing space, 
                we ensure every detail reflects your lifestyle or brand identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

