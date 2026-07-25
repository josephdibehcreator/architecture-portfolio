'use client'

import styles from './PermitsHero.module.css'

export default function PermitsHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Preliminary Declaration & Approvals</span>
            </div>
            
            <h1 className={styles.title}>
              Preliminary Declaration & Planning Approvals for "Déclaration Préalable"
            </h1>
            
            <p className={styles.subtitle}>
              DP Specialist • Administrative Navigation • PLU Compliance
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                The French administrative system can be complex. We specialize in managing the 
                <strong> Déclaration Préalable (DP)</strong>, the essential permit for projects that do not 
                require a full Building Permit. This includes <strong>extensions, window changes, swimming pools, 
                and facade renovations</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

