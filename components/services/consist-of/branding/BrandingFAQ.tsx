'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './BrandingFAQ.module.css'

const faqs = [
  {
    question: 'Do you only work with architects?',
    answer: 'Not at all. We bring our high-end design aesthetic to businesses in hospitality, luxury retail, real estate, and professional services. While our roots are in architecture, our design thinking and aesthetic principles translate beautifully to any industry that values quality, sophistication, and strategic brand positioning.',
  },
  {
    question: 'What is a \'Digital Presence\' strategy?',
    answer: 'It\'s more than just a website. It\'s a roadmap for how your brand appears across Google, social media, and your own site to ensure you are easily found by your ideal customers. A comprehensive digital presence strategy includes SEO optimization, content strategy, social media alignment, and conversion optimization—all working together to build your brand\'s visibility and credibility online.',
  },
  {
    question: 'Can you help with my existing brand?',
    answer: 'Yes. We offer "Brand Audits" to identify where your current identity might be falling short and provide a strategic refresh to modernize your look. Whether you need a complete rebrand or subtle refinements, we analyze your current brand, market position, and competition to create a strategic plan that elevates your brand while maintaining recognition.',
  },
  {
    question: 'How do we start?',
    answer: 'Every project begins with a brand discovery session. We dive deep into your business goals, target audience, and core values before we ever touch a design tool. This foundational work ensures that every design decision is strategic and aligned with your business objectives. From there, we develop a comprehensive brand strategy and visual identity that authentically represents who you are and where you want to go.',
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

export default function BrandingFAQ() {
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

