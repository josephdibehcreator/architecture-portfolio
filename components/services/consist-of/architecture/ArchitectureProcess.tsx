'use client'

import { Lightbulb, PenTool, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ArchitectureProcess.module.css'

export default function ArchitectureProcess() {
  const { t } = useLanguage()
  
  const phases = [
    {
      icon: Lightbulb,
      code: 'ESQ',
      title: t('architecture_process_phase1_title'),
      subtitle: t('architecture_process_phase1_subtitle'),
      description: t('architecture_process_phase1_desc'),
      deliverables: [
        t('architecture_process_phase1_deliverable1'),
        t('architecture_process_phase1_deliverable2'),
        t('architecture_process_phase1_deliverable3'),
      ],
    },
    {
      icon: PenTool,
      code: 'APS',
      title: t('architecture_process_phase2_title'),
      subtitle: t('architecture_process_phase2_subtitle'),
      description: t('architecture_process_phase2_desc'),
      deliverables: [
        t('architecture_process_phase2_deliverable1'),
        t('architecture_process_phase2_deliverable2'),
        t('architecture_process_phase2_deliverable3'),
        t('architecture_process_phase2_deliverable4'),
      ],
    },
    {
      icon: FileText,
      code: 'APD',
      title: t('architecture_process_phase3_title'),
      subtitle: t('architecture_process_phase3_subtitle'),
      description: t('architecture_process_phase3_desc'),
      deliverables: [
        t('architecture_process_phase3_deliverable1'),
        t('architecture_process_phase3_deliverable2'),
        t('architecture_process_phase3_deliverable3'),
        t('architecture_process_phase3_deliverable4'),
      ],
    },
  ]
  return (
    <section className={styles.process}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>{t('architecture_process_label')}</span>
            <h2 className={styles.title}>{t('architecture_process_title')}</h2>
          </div>

          <div className={styles.cardsGrid}>
            {phases.map((phase, index) => {
              const Icon = phase.icon
              return (
                <div key={index} className={styles.cardWrapper}>
                  <div className={`${styles.phaseCard} hover-trigger`}>
                    <div className={`${styles.corner} ${styles.cornerTopLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerTopRight}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomLeft}`} />
                    <div className={`${styles.corner} ${styles.cornerBottomRight}`} />

                    <div className={styles.iconContainer}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>

                    <h3 className={styles.phaseTitle}>
                      <span className={styles.phaseNumber}>{index + 1}.</span> {phase.title}
                    </h3>
                    
                    <div className={styles.phaseCodeWrapper}>
                      <span className={styles.phaseCode}>{phase.code}</span>
                      <span className={styles.phaseSubtitle}>{phase.subtitle}</span>
                    </div>

                    <p className={styles.phaseDescription}>{phase.description}</p>

                    <div className={styles.deliverables}>
                      <span className={styles.deliverablesLabel}>{t('architecture_process_deliverables_label')}</span>
                      <ul className={styles.deliverablesList}>
                        {phase.deliverables.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
