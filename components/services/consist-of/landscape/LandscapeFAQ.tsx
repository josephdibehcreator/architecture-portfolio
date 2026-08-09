'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './LandscapeFAQ.module.css'

const faqs = [
  {
    question: 'Can you design a pool and its surroundings?',
    answer: 'Yes, we specialize in pool integration that complements the architectural style of your home. We design pool areas, decking, and surrounding landscapes that create a cohesive outdoor living environment. Our approach ensures the pool area feels like a natural extension of your home while maintaining functionality and aesthetic harmony.',
  },
  {
    question: 'Do you design for urban terraces?',
    answer: 'We create "urban oases" for balconies and rooftops, maximizing small outdoor footprints. Our urban terrace designs focus on container gardening, vertical planting, efficient space utilization, and creating intimate outdoor retreats that provide privacy and tranquility in urban settings.',
  },
  {
    question: 'Is landscape design included in the architecture phase?',
    answer: 'It can be integrated into the APD phase to ensure a holistic project vision. When landscape design is included from the beginning, we can coordinate hardscaping, drainage, and planting schemes with the architectural plans, ensuring seamless integration and avoiding costly modifications later.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function LandscapeFAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.faq}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

