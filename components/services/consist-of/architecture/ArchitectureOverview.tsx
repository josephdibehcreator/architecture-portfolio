'use client'

import { Network, FileCheck, Home } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ArchitectureOverview.module.css'

export default function ArchitectureOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.textSection}>
            <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('architecture_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('architecture_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Home size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('architecture_feature_specialty_title')}</h3>
              <p className={styles.featureText}>
                {t('architecture_feature_specialty_desc')}
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
                <FileCheck size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('architecture_feature_phases_title')}</h3>
              <p className={styles.featureText}>
                {t('architecture_feature_phases_desc')}
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
                <Network size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('architecture_feature_network_title')}</h3>
              <p className={styles.featureText}>
                {t('architecture_feature_network_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
