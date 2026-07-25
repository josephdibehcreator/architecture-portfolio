'use client'

import { Box, CheckSquare, Presentation } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './3DPrintingOverview.module.css'

export default function ThreeDPrintingOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('printing_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('printing_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Box size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('printing_feature_manufacturing_title')}</h3>
              <p className={styles.featureText}>
                {t('printing_feature_manufacturing_desc')}
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
                <CheckSquare size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('printing_feature_validation_title')}</h3>
              <p className={styles.featureText}>
                {t('printing_feature_validation_desc')}
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
                <Presentation size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('printing_feature_communication_title')}</h3>
              <p className={styles.featureText}>
                {t('printing_feature_communication_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

