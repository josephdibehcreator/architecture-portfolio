'use client'

import styles from './BrandingHero.module.css'

export default function BrandingHero() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.breadcrumb}>
              <span className={styles.label}>01. Services</span>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>Branding & Digital Presence</span>
            </div>
            
            <h1 className={styles.title}>
              Strategic Branding & Digital Identity for Businesses & Hospitality
            </h1>
            
            <p className={styles.subtitle}>
              Visual Identity • Digital Strategy • Brand Positioning
            </p>
            
            <div className={styles.highlight}>
              <p className={styles.highlightText}>
                We believe that building a brand is very similar to building a house: it requires 
                <strong> a solid foundation, a clear structure, and a beautiful exterior</strong>. 
                While our roots are in architecture, we apply the same Design Thinking to help businesses 
                across all sectors—from boutique hotels and restaurants to service-based startups—create 
                <strong> a powerful and cohesive visual identity</strong>.
              </p>
              <p className={styles.highlightText} style={{ marginTop: '1rem' }}>
                In a digital-first world, your brand is your "virtual architecture." We ensure that your 
                digital presence is as well-designed and functional as a physical space. Whether you are 
                launching a new hospitality concept or refreshing an established company, we help you 
                communicate your unique story to the right audience through <strong>high-end design</strong> 
                and <strong>data-driven digital strategies</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

