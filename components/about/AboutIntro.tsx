'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './AboutIntro.module.css'

export default function AboutIntro() {
  const { t } = useLanguage()
  
  return (
    <section className={styles.intro}>
      <div className="container-fluid">
        <div className={styles.content}>
          <p className={styles.text}>
            {t('about_intro_text')}
          </p>
        </div>
      </div>
    </section>
  )
}

