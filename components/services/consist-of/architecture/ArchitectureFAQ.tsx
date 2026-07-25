'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './ArchitectureFAQ.module.css'

const faqs = [
  {
    question: 'What is the "150m² rule" in France?',
    answer: 'If your total floor area after work exceeds 150m², a licensed architect is mandatory for the Building Permit. We handle the design and connect you with the right partners for the permit.',
  },
  {
    question: 'Can you stay on the project after the APD phase?',
    answer: 'Absolutely. While a partner firm handles the structural permit, we stay on as your Interior and Landscape designers to ensure a high-end finish.',
  },
  {
    question: 'Do you handle the "Déclaration Préalable" (DP)?',
    answer: 'Yes, for all projects within the DP limits, we manage the entire administrative dossier from start to finish.',
  },
  {
    question: 'How long does the design process typically take?',
    answer: 'The timeline varies by project complexity. ESQ phase takes 2-3 weeks, APS 3-4 weeks, and APD 4-6 weeks. Administrative approval for DP takes 1-2 months after submission.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve the Paris region and surrounding departments, with a focus on projects in urban planning zones (U-zones) where we have extensive experience with local regulations.',
  },
  {
    question: 'Do you provide cost estimates?',
    answer: 'Yes, we provide detailed cost estimates at the APD phase, based on current market rates and specifications. This helps you plan your budget accurately before moving to construction.',
  },
]

export default function ArchitectureFAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.faq}>
      <div className="container-fluid">
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.label}>{t('service_faq_label')}</span>
            <h2 className={styles.title}>{t('service_faq_title')}</h2>
          </div>

          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
              >
                <button
                  className={`${styles.faqQuestion} hover-trigger`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.icon}>
                    {openIndex === index ? (
                      <Minus size={20} strokeWidth={1.5} />
                    ) : (
                      <Plus size={20} strokeWidth={1.5} />
                    )}
                  </span>
                </button>
                <div
                  className={`${styles.faqAnswer} ${
                    openIndex === index ? styles.open : ''
                  }`}
                >
                  <p className={styles.answerText}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
