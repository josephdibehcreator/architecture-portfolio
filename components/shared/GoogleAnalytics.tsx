'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { hasAnalyticsConsent, ANALYTICS_CONSENT_EVENT } from './legal-scripts/consent'

const GA_MEASUREMENT_ID = 'G-ESPTY58V3P'

/**
 * Google Analytics component (GA4)
 * Only loads if user has given explicit consent for analytics cookies
 */
export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial check on mount
    if (hasAnalyticsConsent()) {
      setEnabled(true)
    }

    const handleConsentChange = () => {
      if (hasAnalyticsConsent()) {
        setEnabled(true)
      } else {
        // Do not remove already loaded scripts, but stop enabling on future loads
        setEnabled(false)
      }
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange)

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange)
    }
  }, [])

  // Don't render anything if no consent or during SSR/build
  if (!enabled) {
    return null
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        id="google-analytics-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
