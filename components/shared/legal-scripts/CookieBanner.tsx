'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  COOKIE_NOTICE_ACK_NAME,
  COOKIE_ANALYTICS_CONSENT_NAME,
  getCookie,
  setCookie,
  dispatchConsentChanged,
} from './consent'
import styles from './CookieBanner.module.css'

export default function CookieBanner({
  onOpenCookiePolicy,
}: {
  onOpenCookiePolicy: (el: HTMLElement | null) => void
}) {
  const { language } = useLanguage()
  const [visible, setVisible] = useState(false)
  const linkRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Banner is controlled by acknowledgement cookie only (strictly necessary)
    const hasAcknowledged = typeof document !== 'undefined' && getCookie(COOKIE_NOTICE_ACK_NAME) === 'true'
    setVisible(!hasAcknowledged)
  }, [])

  const handleAcceptAnalytics = () => {
    setCookie(COOKIE_ANALYTICS_CONSENT_NAME, 'true')
    setCookie(COOKIE_NOTICE_ACK_NAME, 'true')
    dispatchConsentChanged()
    setVisible(false)
  }

  const handleRejectAnalytics = () => {
    setCookie(COOKIE_ANALYTICS_CONSENT_NAME, 'false')
    setCookie(COOKIE_NOTICE_ACK_NAME, 'true')
    dispatchConsentChanged()
    setVisible(false)
  }

  const handleOpenCookiePolicy = () => {
    onOpenCookiePolicy(linkRef.current)
  }

  const isEn = language === 'en'
  const message = isEn
    ? 'We use strictly necessary cookies to run this site (e.g. session, language, security). With your consent, we may also use Google Analytics to measure audience and improve the site. You can accept or reject analytics at any time.'
    : 'Nous utilisons des cookies strictement nécessaires au fonctionnement du site (session, langue, sécurité). Avec votre consentement, nous pouvons aussi utiliser Google Analytics pour mesurer l’audience et améliorer le site. Vous pouvez accepter ou refuser les cookies d’analyse à tout moment.'
  const learnMore = isEn ? 'Cookie Policy' : 'Politique de cookies'
  const acceptLabel = isEn ? 'Accept analytics' : 'Accepter les cookies d’analyse'
  const rejectLabel = isEn ? 'Reject analytics' : 'Refuser les cookies d’analyse'

  if (!visible) return null

  return (
    <div className={styles.banner} role="region" aria-label={isEn ? 'Cookie notice' : 'Information cookies'}>
      <div className={styles.bannerInner}>
        <p className={styles.bannerText}>
          {message}{' '}
          <button
            ref={linkRef}
            type="button"
            className={styles.bannerLink}
            onClick={handleOpenCookiePolicy}
            aria-label={learnMore}
          >
            {learnMore}
          </button>
        </p>
        <div className={styles.bannerActions}>
          <button
            type="button"
            className={styles.bannerBtn}
            onClick={handleRejectAnalytics}
            aria-label={rejectLabel}
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            className={styles.bannerBtn}
            onClick={handleAcceptAnalytics}
            aria-label={acceptLabel}
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

