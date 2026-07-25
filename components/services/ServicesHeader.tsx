'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ServicesHeader.module.css'

export default function ServicesHeader() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.header}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.left}>
            <span className={styles.label}>{t('services_header_label')}</span>
            <h1 className={styles.title}>
              {t('services_header_title_part1')}
              <span className={styles.accent}> {t('services_header_title_part2')}</span>
              {' '}{t('services_header_title_part3')}
            </h1>
          </div>
          <div className={styles.right}>
            <p className={styles.description}>
              {t('services_header_description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

