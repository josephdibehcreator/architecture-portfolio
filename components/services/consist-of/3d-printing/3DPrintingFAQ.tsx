'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './3DPrintingFAQ.module.css'

const faqs = [
  {
    question: 'What materials do you use?',
    answer: 'We use high-resolution resins and plastics (PLA) depending on the level of detail required. Resin printing provides exceptional detail and smooth surfaces for presentation models, while PLA offers durability and cost-effectiveness for larger models or design verification prototypes. We select the material that best suits your project\'s needs and budget.',
  },
  {
    question: 'Can you print from my CAD file?',
    answer: 'Yes, we can translate most 3D files (STL, OBJ, etc.) into a printable format. We work with standard 3D file formats including STL, OBJ, 3MF, and can often work with native CAD formats. If needed, we can also help optimize your model for 3D printing, ensuring proper wall thickness, support structures, and printability.',
  },
  {
    question: 'How long does it take?',
    answer: 'Most models are printed and finished within 3 to 5 business days. The timeline depends on model complexity, size, and finishing requirements. Simple models may be ready faster, while complex or large-scale models with detailed finishing may take longer. We provide accurate timelines during the quotation phase.',
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

export default function ThreeDPrintingFAQ() {
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

