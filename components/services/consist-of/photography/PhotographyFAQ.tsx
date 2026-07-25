'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './PhotographyFAQ.module.css'

const faqs = [
  {
    question: 'How do Virtual Tours improve my SEO?',
    answer: 'They increase "time on page," a key metric Google uses to rank websites higher in search results. Virtual tours keep visitors engaged longer, reduce bounce rates, and provide rich, interactive content that search engines favor. This improved engagement signals to search algorithms that your content is valuable, leading to better rankings and increased organic traffic.',
  },
  {
    question: 'Can you photograph for luxury real estate?',
    answer: 'Yes, we specialize in capturing the high-end details and lighting that luxury buyers expect. Our photography emphasizes premium materials, architectural details, and sophisticated lighting that showcases the quality and exclusivity of luxury properties. We understand the nuances of luxury marketing and create imagery that appeals to discerning buyers.',
  },
  {
    question: 'Do you offer drone shots?',
    answer: 'Yes, we provide aerial perspectives to show the property in its wider context. Drone photography is perfect for showcasing large estates, properties with extensive grounds, or highlighting a property\'s relationship to its surroundings. Aerial views provide valuable context that ground-level photography cannot capture, making them essential for comprehensive property marketing.',
  },
]

export default function PhotographyFAQ() {
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

