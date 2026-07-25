'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './FounderQuote.module.css'

export default function FounderQuote() {
  const { t } = useLanguage()
  
  return (
    <section className={`${styles.section} hover-trigger`}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.quoteMark}>"</div>
          <div className={styles.quoteContent}>
            <div className={styles.quotes}>
              <p className={styles.quote}>
                {t('founder_quote_1')}
              </p>
              <p className={styles.quote}>
                {t('founder_quote_2')}
              </p>
            </div>
            <div className={styles.author}>
              <div className={styles.line}></div>
              <div>
                <h4 className={styles.name}>{t('founder_name')}</h4>
                <p className={styles.role}>{t('founder_role')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

