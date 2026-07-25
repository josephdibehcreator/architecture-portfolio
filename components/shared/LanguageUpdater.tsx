'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Client component that updates the HTML lang attribute
 * Must be used inside LanguageProvider
 */
export default function LanguageUpdater() {
  const { language } = useLanguage()

  useEffect(() => {
    // Update HTML lang attribute whenever language changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
      // Also update the html element's lang attribute via DOM
      const htmlElement = document.documentElement
      if (htmlElement.getAttribute('lang') !== language) {
        htmlElement.setAttribute('lang', language)
      }
    }
  }, [language])

  return null
}

