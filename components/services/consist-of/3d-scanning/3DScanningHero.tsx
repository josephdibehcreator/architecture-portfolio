'use client'

import styles from './3DScanningHero.module.css'

export default function ThreeDScanningHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>3D Scanning</span>
            </div>
            
            <h1 className={styles.title}>
              Precision 3D Laser Scanning & Immersive Virtual Tours
            </h1>
            
            <p className={styles.subtitle}>
              LiDAR Technology • Millimeter Accuracy • 360° Immersion
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                We utilize state-of-the-art <strong>LiDAR technology</strong> to capture the "as-built" reality of any space. 
                This provides a <strong>millimeter-accurate digital foundation</strong> for our architectural and interior projects. 
                Beyond technical data, we offer <strong>3D Virtual Tours (Matterport-style)</strong>, allowing you to explore a space 
                remotely with 360-degree immersion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

