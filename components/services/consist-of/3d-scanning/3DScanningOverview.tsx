'use client'

import { Scan, Database, Eye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './3DScanningOverview.module.css'

export default function ThreeDScanningOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('scanning_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('scanning_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Scan size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('scanning_feature_precision_title')}</h3>
              <p className={styles.featureText}>
                {t('scanning_feature_precision_desc')}
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
                <Database size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('scanning_feature_documentation_title')}</h3>
              <p className={styles.featureText}>
                {t('scanning_feature_documentation_desc')}
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
                <Eye size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('scanning_feature_virtual_title')}</h3>
              <p className={styles.featureText}>
                {t('scanning_feature_virtual_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

