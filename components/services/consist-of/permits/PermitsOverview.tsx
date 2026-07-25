'use client'

import { FileText, CheckCircle, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './PermitsOverview.module.css'

export default function PermitsOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('permits_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('permits_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <FileText size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('permits_feature_documentation_title')}</h3>
              <p className={styles.featureText}>
                {t('permits_feature_documentation_desc')}
              </p>
            </div>
          </div>

          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <CheckCircle size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('permits_feature_compliance_title')}</h3>
              <p className={styles.featureText}>
                {t('permits_feature_compliance_desc')}
              </p>
            </div>
          </div>

          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Shield size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('permits_feature_navigation_title')}</h3>
              <p className={styles.featureText}>
                {t('permits_feature_navigation_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

