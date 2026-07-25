'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import styles from './Methodology.module.css'

export default function Methodology() {
  const { t } = useLanguage()
  
  const phases = [
    {
      number: '01',
      title: t('methodology_phase1_title'),
      description: t('methodology_phase1_description'),
      tasks: [
        {
          code: 'REL/DIAG',
          name: t('methodology_phase1_task1_name'),
          description: t('methodology_phase1_task1_desc'),
        },
        {
          code: 'ESQ',
          name: t('methodology_phase1_task2_name'),
          description: t('methodology_phase1_task2_desc'),
        },
        {
          code: 'APS',
          name: t('methodology_phase1_task3_name'),
          description: t('methodology_phase1_task3_desc'),
        },
        {
          code: 'APD',
          name: t('methodology_phase1_task4_name'),
          description: t('methodology_phase1_task4_desc'),
        },
      ],
    },
    {
      number: '02',
      title: t('methodology_phase2_title'),
      description: t('methodology_phase2_description'),
      tasks: [
        {
          code: 'DP',
          name: t('methodology_phase2_task1_name'),
          description: t('methodology_phase2_task1_desc'),
        },
        {
          code: 'DCE',
          name: t('methodology_phase2_task2_name'),
          description: t('methodology_phase2_task2_desc'),
        },
        {
          code: 'ACT',
          name: t('methodology_phase2_task3_name'),
          description: t('methodology_phase2_task3_desc'),
        },
      ],
    },
    {
      number: '03',
      title: t('methodology_phase3_title'),
      description: t('methodology_phase3_description'),
      tasks: [
        {
          code: 'DET',
          name: t('methodology_phase3_task1_name'),
          description: t('methodology_phase3_task1_desc'),
        },
        {
          code: 'AOR',
          name: t('methodology_phase3_task2_name'),
          description: t('methodology_phase3_task2_desc'),
        },
        {
          code: 'DOE',
          name: t('methodology_phase3_task3_name'),
          description: t('methodology_phase3_task3_desc'),
        },
      ],
    },
  ]
  return (
    <section className={styles.methodology}>
      <div className={styles.gridDecoration}></div>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>{t('methodology_label')}</span>
            <h2 className={styles.title}>{t('methodology_title')}</h2>
            <p className={styles.description}>
              {t('methodology_description')}
            </p>
          </div>

          <div className={styles.timeline}>
            {phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className={`${styles.phase} hover-trigger`}>
                <div className={styles.timelineNode}></div>
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}>{phase.number}</span>
                  <div>
                    <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  </div>
                </div>
                <p className={styles.phaseDescription}>{phase.description}</p>
                <div className={styles.tasksGrid}>
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className={styles.task}>
                      <div className={styles.taskHeader}>
                        <div className={styles.taskLine}></div>
                        <h4 className={styles.taskCode}>{task.code} ({task.name})</h4>
                      </div>
                      <p className={styles.taskDescription}>{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.spacer}></div>
    </section>
  )
}

