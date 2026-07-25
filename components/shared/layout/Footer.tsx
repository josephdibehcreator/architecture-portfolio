'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { sitePrivacyMeta } from '@/config/siteMetadata'
import { socialLinks } from '@/config/socialLinks'
import PrivacyPolicyModal from '@/components/shared/legal-scripts/PrivacyPolicyModal'
import TermsOfServiceModal from '@/components/shared/legal-scripts/TermsOfServiceModal'
import styles from './Footer.module.css'

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export default function Footer({
  openCookiePolicy,
}: {
  openCookiePolicy?: (el: HTMLElement | null) => void
} = {}) {
  const { language, setLanguage, t } = useLanguage()
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const privacyTriggerRef = useRef<HTMLButtonElement>(null)
  const termsTriggerRef = useRef<HTMLButtonElement>(null)
  const cookiePolicyTriggerRef = useRef<HTMLButtonElement>(null)
  
  const handleLanguageToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const newLanguage = language === 'en' ? 'fr' : 'en'
    setLanguage(newLanguage)
  }
  
  return (
    <footer className={styles.footer}>
      <div className="container-fluid">
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <Link href="/" className={styles.footerLogo}>
              <Image
                src="https://res.cloudinary.com/dszlnbdap/image/upload/v1774436050/logo-trans-with-text_unjkjl.png"
                alt="Joseph Dibeh"
                width={96}
                height={96}
                className={styles.logoImage}
                unoptimized
              />
            </Link>
            <p className={styles.footerDescription}>
              {t('footer_description')}
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>{t('studio')}</h4>
            <p className={styles.footerText}>{t('paris')}</p>
            <p className={styles.footerText}>{t('french_riviera')}</p>
            <p className={styles.footerText}>{t('beirut')}</p>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>{t('contact')}</h4>
            <a href="tel:+33666003204" className={`${styles.footerLink} hover-trigger`}>
              +33 6 66 00 32 04
            </a>
            <a href="mailto:contact@dibeh-architecture.com" className={`${styles.footerLink} hover-trigger`}>
             contact@dibeh-architecture.com
             </a>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>{t('social')}</h4>
            <div className={styles.socialLinks}>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-trigger"
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-trigger"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover-trigger"
                aria-label="TikTok"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            {t('copyright')}
          </p>
          <div className={styles.footerLinks}>
            <button
              type="button"
              ref={privacyTriggerRef}
              data-pp-trigger
              data-testid="privacy-policy-trigger"
              className={styles.footerLinkButton}
              onClick={() => setShowPrivacy(true)}
            >
              {t('privacy_policy')}
            </button>
            <button
              type="button"
              ref={termsTriggerRef}
              data-pp-trigger
              data-testid="terms-trigger"
              className={styles.footerLinkButton}
              onClick={(e) => {
                e.preventDefault()
                setShowTerms(true)
              }}
            >
              {t('terms_of_service')}
            </button>
            {openCookiePolicy && (
              <button
                type="button"
                ref={cookiePolicyTriggerRef}
                data-testid="cookie-policy-trigger"
                className={styles.footerLinkButton}
                onClick={() => openCookiePolicy(cookiePolicyTriggerRef.current)}
              >
                {t('cookie_policy')}
              </button>
            )}
            <button
              className={styles.languageToggle}
              onClick={handleLanguageToggle}
              aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
              type="button"
              aria-pressed={language === 'fr'}
            >
              <span className={`${language === 'en' ? styles.active : ''}`} data-lang="en">EN</span>
              <span className={styles.separator}>/</span>
              <span className={`${language === 'fr' ? styles.active : ''}`} data-lang="fr">FR</span>
            </button>
          </div>
        </div>
      </div>
      <PrivacyPolicyModal
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        siteMeta={sitePrivacyMeta}
        triggerRef={privacyTriggerRef}
      />
      <TermsOfServiceModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        siteMeta={sitePrivacyMeta}
        triggerRef={termsTriggerRef}
      />
    </footer>
  )
}

