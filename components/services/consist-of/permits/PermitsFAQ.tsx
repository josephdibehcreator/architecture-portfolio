'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './PermitsFAQ.module.css'

const faqs = [
  {
    question: 'What is the limit for a DP?',
    answer: 'Usually for extensions up to 20m² (or 40m² in urban areas) and all exterior modifications. The Déclaration Préalable covers projects that don\'t require a full Building Permit, including small extensions, window changes, facade modifications, and swimming pools. Specific limits can vary by local PLU regulations.',
  },
  {
    question: 'How long does it take?',
    answer: 'The instruction period is typically 1 month, or 2 months in protected areas. Once submitted, the administration has one month to respond (two months in heritage zones or protected areas). If no response is received within this period, the project is considered approved by default (tacit approval).',
  },
  {
    question: 'What if I need a full Building Permit (PC)?',
    answer: 'For projects over the limit, we handle the conceptual design and partner with licensed architects to secure your PC. We manage the design phases (ESQ, APS, APD) and coordinate with our network of partner architectural firms who handle the Building Permit application and construction oversight phases.',
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

export default function PermitsFAQ() {
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

