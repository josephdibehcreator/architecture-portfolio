'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './3DScanningFAQ.module.css'

const faqs = [
  {
    question: 'How accurate is the 3D scan?',
    answer: 'Our scans provide 2-3mm accuracy, essential for custom cabinetry and structural extensions. This level of precision ensures that design decisions are based on exact measurements, reducing errors and costly modifications during construction.',
  },
  {
    question: 'Who is the Virtual Tour for?',
    answer: 'It\'s an incredible tool for architects during the survey phase and for owners wanting a "before and after" record. Virtual tours are also perfect for remote stakeholders, international clients, or anyone who needs to explore a space without being physically present.',
  },
  {
    question: 'What file formats do you deliver?',
    answer: 'We provide .E57 point clouds, .DWG plans, or web-based 3D tours. The .E57 format is industry-standard for point cloud data and can be imported into most CAD and BIM software. .DWG files are ready for use in AutoCAD and similar programs. Web-based tours are accessible through any browser without additional software.',
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

export default function ThreeDScanningFAQ() {
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

