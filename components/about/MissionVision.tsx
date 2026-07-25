'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './MissionVision.module.css'

export default function MissionVision() {
  const { t } = useLanguage()
  
  const items = [
    {
      number: '01',
      label: t('mission_label'),
      title: t('mission_title'),
      description: t('mission_description'),
    },
    {
      number: '02',
      label: t('vision_label'),
      title: t('vision_title'),
      description: t('vision_description'),
    },
    {
      number: '03',
      label: t('philosophy_label'),
      title: t('philosophy_title'),
      description: t('philosophy_description'),
    },
  ]

  return (
    <section className={styles.section}>
      <div className="container-fluid">
        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={`${styles.card} hover-trigger`}>
              <span className={styles.label}>{item.number}. {item.label}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

