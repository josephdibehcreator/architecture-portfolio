'use client'

import styles from './3DPrintingHero.module.css'

export default function ThreeDPrintingHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>3D Printing</span>
            </div>
            
            <h1 className={styles.title}>
              Architectural 3D Printing: Physical Scale Models & Prototyping
            </h1>
            
            <p className={styles.subtitle}>
              Scale Models • Design Verification • Presentation Tools
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                Bridge the gap between digital screen and physical reality. We provide 
                <strong> high-detail 3D printed models (maquettes)</strong> for architectural presentations 
                and urban planning. <strong>Physical models are the ultimate tool</strong> for communicating 
                volume and scale to clients and local authorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

