'use client'

import { Palette, Search, Target, Store } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './BrandingOverview.module.css'

export default function BrandingOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('branding_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('branding_overview_desc') }} />
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.cardWrapper}>
            <div className={`${styles.featureCard} hover-trigger`}>
              <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
              <div className={`${styles.corner} ${styles.cornerTopRight}`} />
              <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
              <div className={`${styles.corner} ${styles.cornerBottomRight}`} />
              <div className={styles.iconWrapper}>
                <Palette size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('branding_feature_aesthetic_title')}</h3>
              <p className={styles.featureText}>
                {t('branding_feature_aesthetic_desc')}
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
                <Search size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('branding_feature_strategy_title')}</h3>
              <p className={styles.featureText}>
                {t('branding_feature_strategy_desc')}
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
                <Target size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('branding_feature_positioning_title')}</h3>
              <p className={styles.featureText}>
                {t('branding_feature_positioning_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

