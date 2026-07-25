'use client'

import { Home, Lightbulb, Package } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './InteriorDesignOverview.module.css'

export default function InteriorDesignOverview() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.overview}>
      <div className="container-fluid">
        <div className={styles.content}>
        <div className={styles.textSection}>
          <span className={styles.label}>{t('service_overview_label')}</span>
          <h2 className={styles.title}>
            {t('interior_overview_title')}
          </h2>
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: t('interior_overview_desc') }} />
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
              <h3 className={styles.featureTitle}>{t('interior_feature_integration_title')}</h3>
              <p className={styles.featureText}>
                {t('interior_feature_integration_desc')}
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
                <Lightbulb size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('interior_feature_custom_title')}</h3>
              <p className={styles.featureText}>
                {t('interior_feature_custom_desc')}
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
                <Package size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.featureTitle}>{t('interior_feature_turnkey_title')}</h3>
              <p className={styles.featureText}>
                {t('interior_feature_turnkey_desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

