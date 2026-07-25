'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import type { SitePrivacyMeta } from '@/config/siteMetadata'
import {
  COOKIE_ANALYTICS_CONSENT_NAME,
  hasAnalyticsConsent,
  setCookie,
  dispatchConsentChanged,
} from './consent'
import styles from './CookiePolicyModal.module.css'

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  )
}

function replacePlaceholders(str: string, siteMeta: SitePrivacyMeta): string {
  return str
    .replace(/\[SITE_NAME\]/g, siteMeta.name ?? '[SITE_NAME]')
    .replace(/\[EFFECTIVE_DATE\]/g, siteMeta.effectiveDate ?? '[EFFECTIVE_DATE]')
    .replace(/\[CONTACT_EMAIL\]/g, siteMeta.email ?? '[CONTACT_EMAIL]')
    .replace(/\[ADDRESS\]/g, siteMeta.address ?? '[ADDRESS]')
}

export default function CookiePolicyModal({
  open = false,
  onClose = () => {},
  siteMeta = {},
  triggerRef,
}: {
  open?: boolean
  onClose?: () => void
  siteMeta?: SitePrivacyMeta
  triggerRef?: React.RefObject<HTMLElement | null>
}) {
  const { language } = useLanguage()
  const dialogRef = useRef<HTMLDivElement>(null)
  const headerCloseRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const t = (en: string, fr: string) => (language === 'fr' ? fr : en)

  const replace = (str: string) => replacePlaceholders(str, siteMeta)

  const hasPlaceholders = (text: string) =>
    /\[(?:SITE_NAME|EFFECTIVE_DATE|CONTACT_EMAIL|ADDRESS)\]/i.test(text)

  useEffect(() => {
    if (open) {
      previouslyFocused.current =
        (triggerRef?.current as HTMLElement) ?? (document.activeElement as HTMLElement)
      document.body.style.overflow = 'hidden'
      const timeoutId = setTimeout(() => headerCloseRef.current?.focus(), 0)

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
          return
        }
        if (e.key !== 'Tab' || !dialogRef.current) return
        const focusable = getFocusableElements(dialogRef.current)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const current = document.activeElement as HTMLElement
        if (e.shiftKey) {
          if (current === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (current === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      document.addEventListener('keydown', onKeyDown)
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = ''
        previouslyFocused.current?.focus?.()
      }
    }
  }, [open, onClose, triggerRef])

  const sectionsEn = [
    {
      title: 'What are cookies?',
      body: 'Cookies are small text files stored on your device when you visit a website. They allow the site to remember your preferences and support basic functionality. Under EU and French law (ePrivacy and GDPR), cookies that are strictly necessary for the operation of the site do not require your prior consent.',
    },
    {
      title: 'What cookies we use',
      body: 'This website uses strictly necessary (technical) cookies, for example to maintain session security, remember your language preference and store your cookie choices. With your prior consent, we may also use analytics cookies (Google Analytics) to measure audience and understand how the site is used.',
    },
    {
      title: 'Strictly necessary cookies',
      body: 'Strictly necessary cookies are required for the website to function correctly. They support essential operations such as remembering your cookie preferences and session state. Under the GDPR and French data protection rules, these cookies do not require consent because they are indispensable for the service you request.',
    },
    {
      title: 'Analytics cookies (optional)',
      body: 'If you consent, we may use Google Analytics to collect anonymous, aggregated information about how visitors use the site (pages visited, time spent, technical errors). These cookies help us improve performance and usability. Analytics cookies are not set unless you have explicitly accepted them, and you can withdraw your consent at any time via the cookie banner or the cookie controls below.',
    },
    {
      title: 'What we do NOT use',
      body: 'We do not use advertising cookies or behavioral tracking cookies. We do not use embedded third-party content (such as advertising networks) that would set profiling cookies. Your visit is not tracked for marketing or behavioral advertising purposes.',
    },
    {
      title: 'How you can manage cookies',
      body: 'You can manage your analytics consent directly on this site (see the controls below) and you can also control or delete cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a cookie is set. Blocking all cookies may affect site functionality (for example, language or consent preference may not be saved).',
    },
    {
      title: 'Contact information',
      body: 'For questions about this cookie policy or our use of cookies, please contact us at [CONTACT_EMAIL] or at [ADDRESS]. This policy is effective as of [EFFECTIVE_DATE] and may be updated; the date above will be revised accordingly.',
    },
  ]

  const sectionsFr = [
    {
      title: 'Qu’est-ce qu’un cookie ?',
      body: 'Les cookies sont de petits fichiers texte enregistrés sur votre appareil lors de la visite d’un site. Ils permettent au site de mémoriser vos préférences et d’assurer le bon fonctionnement des fonctionnalités de base. Au titre du droit européen et français (ePrivacy et RGPD), les cookies strictement nécessaires au fonctionnement du site ne nécessitent pas votre consentement préalable.',
    },
    {
      title: 'Cookies que nous utilisons',
      body: 'Ce site utilise des cookies strictement nécessaires (techniques), par exemple pour assurer la sécurité de la session, mémoriser la langue et enregistrer vos choix en matière de cookies. Avec votre consentement préalable, nous pouvons également utiliser des cookies d’analyse (Google Analytics) afin de mesurer l’audience et de comprendre l’utilisation du site.',
    },
    {
      title: 'Cookies strictement nécessaires',
      body: 'Les cookies strictement nécessaires sont indispensables au bon fonctionnement du site. Ils permettent notamment de mémoriser votre préférence en matière de cookies et l’état de la session. Au titre du RGPD et des règles françaises en matière de protection des données, ces cookies ne nécessitent pas de consentement car ils sont indispensables au service demandé.',
    },
    {
      title: 'Cookies d’analyse (optionnels)',
      body: 'Avec votre consentement, nous pouvons utiliser Google Analytics pour recueillir des informations anonymes et agrégées sur la fréquentation du site (pages consultées, temps passé, erreurs techniques). Ces cookies nous aident à améliorer les performances et l’ergonomie. Les cookies d’analyse ne sont déposés que si vous les acceptez explicitement, et vous pouvez retirer votre consentement à tout moment via la bannière de cookies ou les contrôles ci-dessous.',
    },
    {
      title: 'Ce que nous n’utilisons pas',
      body: 'Nous n’utilisons pas de cookies publicitaires ni de suivi comportemental. Nous n’intégrons pas de contenus tiers publicitaires susceptibles de déposer des cookies de profilage. Votre visite n’est pas suivie à des fins de publicité comportementale.',
    },
    {
      title: 'Gestion des cookies par l’utilisateur',
      body: 'Vous pouvez gérer votre consentement aux cookies d’analyse directement sur ce site (voir les contrôles ci-dessous) et également via les paramètres de votre navigateur. La plupart des navigateurs permettent de refuser les cookies, de supprimer les cookies existants ou d’être averti lors du dépôt d’un cookie. Bloquer tous les cookies peut affecter le fonctionnement du site (par exemple, la langue ou votre préférence de consentement pourraient ne pas être enregistrées).',
    },
    {
      title: 'Contact',
      body: 'Pour toute question relative à cette politique de cookies ou à notre utilisation des cookies, contactez-nous à [CONTACT_EMAIL] ou à l’adresse [ADDRESS]. Cette politique est en vigueur à compter du [EFFECTIVE_DATE] et peut être mise à jour ; la date ci-dessus sera modifiée en conséquence.',
    },
  ]

  const sections = language === 'fr' ? sectionsFr : sectionsEn
  const introLine = replace(
    t(
      'Cookie Policy — [SITE_NAME]. Effective date: [EFFECTIVE_DATE].',
      'Politique de cookies — [SITE_NAME]. Date d’entrée en vigueur : [EFFECTIVE_DATE].'
    )
  )
  const showPlaceholderNote = hasPlaceholders(introLine) || sections.some((s) => hasPlaceholders(replace(s.body)))

  const closeLabel = t('Close', 'Fermer')
  const modalTitle = t('Cookie Policy', 'Politique de cookies')

  const analyticsEnabled = typeof document !== 'undefined' && hasAnalyticsConsent()

  const handleSetAnalytics = (value: boolean) => {
    setCookie(COOKIE_ANALYTICS_CONSENT_NAME, value ? 'true' : 'false')
    dispatchConsentChanged()
  }

  const modalContent = open ? (
    <div
      className={styles.cookieOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      aria-describedby="cookie-modal-content"
      data-testid="cookie-policy-modal"
    >
      <div
        className={styles.cookieBackdrop}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).click()}
        aria-hidden="true"
      />

      <div ref={dialogRef} className={styles.cookieDialog} onClick={(e) => e.stopPropagation()}>
        <header className={styles.cookieHeader}>
          <h2 id="cookie-modal-title" className={styles.cookieTitle}>
            {modalTitle}
          </h2>
          <button
            ref={headerCloseRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={styles.cookieHeaderClose}
          >
            ×
          </button>
        </header>

        <main id="cookie-modal-content" className={styles.cookieBody} tabIndex={-1}>
          <p className={styles.cookieBodyParagraph}>{introLine}</p>

          {sections.map((section, i) => (
            <React.Fragment key={i}>
              <h3 className={styles.cookieSectionTitle}>{section.title}</h3>
              <p className={styles.cookieBodyParagraph}>{replace(section.body)}</p>
            </React.Fragment>
          ))}

          <div className={styles.cookieBodyParagraph} role="group" aria-label={t('Manage analytics cookies', 'Gérer les cookies d’analyse')}>
            <h3 className={styles.cookieSectionTitle}>
              {t('Manage analytics cookies', 'Gérer les cookies d’analyse')}
            </h3>
            <p className={styles.cookieBodyParagraph}>
              {t(
                'You can change your analytics choice at any time. This will affect future visits and page loads.',
                'Vous pouvez modifier votre choix concernant les cookies d’analyse à tout moment. Ce choix s’appliquera aux visites et chargements de pages ultérieurs.'
              )}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSetAnalytics(false)}
                className={styles.cookieFooterBtn}
                aria-pressed={!analyticsEnabled}
              >
                {t('Analytics: Off', 'Analyse : désactivée')}
              </button>
              <button
                type="button"
                onClick={() => handleSetAnalytics(true)}
                className={styles.cookieFooterBtn}
                aria-pressed={analyticsEnabled}
              >
                {t('Analytics: On', 'Analyse : activée')}
              </button>
            </div>
          </div>

          {showPlaceholderNote && (
            <div className={styles.cookiePlaceholderNote} role="status">
              <p>
                <strong>
                  {t(
                    "Please replace placeholders with your studio's contact details.",
                    'Veuillez remplacer les placeholders par les coordonnées de votre studio.'
                  )}
                </strong>
              </p>
              <p>
                {t(
                  'Update the site metadata (e.g. address, email, effective date) so the modal shows your real information.',
                  'Mettez à jour les métadonnées du site (adresse, e-mail, date) pour afficher vos informations réelles.'
                )}
              </p>
            </div>
          )}
        </main>

        <footer className={styles.cookieFooter}>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={styles.cookieFooterBtn}
          >
            {closeLabel}
          </button>
        </footer>
      </div>
    </div>
  ) : null

  if (typeof document === 'undefined') return null
  return createPortal(modalContent, document.body)
}

