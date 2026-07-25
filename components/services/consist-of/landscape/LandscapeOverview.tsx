'use client'

import { Trees, Home, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './LandscapeOverview.module.css'

export default function LandscapeOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('landscape_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('landscape_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Trees size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('landscape_feature_ecosystem_title')}</h3>
              <p className={styles.featureText}>
                {t('landscape_feature_ecosystem_desc')}
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
                <Home size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('landscape_feature_extension_title')}</h3>
              <p className={styles.featureText}>
                {t('landscape_feature_extension_desc')}
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
                <Sparkles size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('landscape_feature_sustainable_title')}</h3>
              <p className={styles.featureText}>
                {t('landscape_feature_sustainable_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

