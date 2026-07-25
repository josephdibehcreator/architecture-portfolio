'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import type { SitePrivacyMeta } from '@/config/siteMetadata'
import styles from './TermsOfServiceModal.module.css'

const TERMS_EN = `Terms of Service — [SITE_NAME]
Effective date: [EFFECTIVE_DATE]

1. Acceptance
By using this website you accept these Terms. If you do not agree, please do not use the Site.

2. What this site is for
This site presents the studio's portfolio, accepts inquiries and career applications, and offers paid consultations via Stripe. There are no public user accounts. The admin interface is for studio staff only.

3. Inquiries, bookings & payments

Requests for quotes or consultations are made via the inquiry flow. Paid consultations use Stripe Checkout.

Payments are processed by Stripe — we do not store card details. Refunds and billing follow the policies described at checkout and may be handled case-by-case.

4. Career applications and uploaded files

Applicants may upload CVs and portfolios. Files are stored with our storage provider (Cloudinary). By submitting, you confirm you have the right to share those files. Remove or redact personal information if you do not want it stored.

5. Admin area

The admin dashboard is restricted. Only authorized staff may access it. If you find a security issue, contact us immediately at [CONTACT_EMAIL].

6. Acceptable use

Do not misuse the Site (no scraping, hacking, reverse engineering, or uploading illegal content). We reserve the right to remove content and block users who violate these rules.

7. Intellectual property

The Site content (designs, text, images) is owned by [PUBLISHER_NAME] unless otherwise stated. You may not republish or reuse images or text without permission.

8. Liability

The Site is provided "as is". We aim for accuracy but do not guarantee uninterrupted availability. To the extent permitted by law, liability is limited.

9. Governing law

These Terms are governed by French law. Disputes may be submitted to the competent French courts.

10. Contact & changes

Contact: [CONTACT_EMAIL] | Phone: [CONTACT_PHONE]

We may update these Terms — the effective date will be changed. Check this page for the latest version.`

const TERMS_FR = `Conditions d'utilisation — [SITE_NAME]
Date d'entrée en vigueur : [EFFECTIVE_DATE]

1. Acceptation
En utilisant ce site vous acceptez ces Conditions. Si vous n'êtes pas d'accord, merci de ne pas utiliser le site.

2. Objet du site
Ce site présente le portfolio du studio, collecte des demandes de contact et des candidatures, et propose des consultations payantes via Stripe. Il n'existe pas de comptes utilisateur publics. L'interface admin est réservée au personnel du studio.

3. Demandes, réservations & paiements

Les demandes de devis ou de consultation passent par le formulaire d'inquiry. Les consultations payantes sont traitées via Stripe Checkout.

Les paiements sont traités par Stripe — nous ne conservons pas les données de carte. Les remboursements et la facturation suivent les règles affichées lors du paiement.

4. Candidatures et fichiers téléchargés

Les candidats peuvent téléverser CV et portfolio. Les fichiers sont stockés chez notre fournisseur (Cloudinary). En soumettant, vous déclarez avoir les droits nécessaires. Retirez les informations personnelles si vous ne souhaitez pas qu'elles soient conservées.

5. Espace admin

L'espace admin est restreint. Seul le personnel autorisé y a accès. Si vous découvrez une faille de sécurité, contactez-nous immédiatement : [CONTACT_EMAIL].

6. Utilisation autorisée

N'abusez pas du site (pas de scraping, hacking, reverse engineering, ni téléchargement de contenus illégaux). Nous nous réservons le droit de retirer du contenu et de bloquer les utilisateurs en faute.

7. Propriété intellectuelle

Les contenus du site (design, textes, images) appartiennent à [PUBLISHER_NAME] sauf mention contraire. Vous ne pouvez pas republier ni réutiliser ces contenus sans autorisation.

8. Responsabilité

Le site est fourni « tel quel ». Nous visons la justesse des informations mais n'assurons pas une disponibilité ininterrompue. Dans la limite permise par la loi, notre responsabilité est limitée.

9. Droit applicable

Ces Conditions sont régies par le droit français. Les litiges relèvent des juridictions compétentes en France.

10. Contact & modifications

Contact : [CONTACT_EMAIL] | Tél : [CONTACT_PHONE]

Nous pouvons mettre à jour ces Conditions — la date d'entrée en vigueur sera modifiée. Vérifiez cette page pour la version la plus récente.`

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  )
}

export default function TermsOfServiceModal({
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
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const headerCloseRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const replace = useCallback(
    (str: string) => {
      const m = siteMeta
      return str
        .replace(/\[SITE_NAME\]/g, m.name ?? '[SITE_NAME]')
        .replace(/\[EFFECTIVE_DATE\]/g, m.effectiveDate ?? '[EFFECTIVE_DATE]')
        .replace(/\[CONTACT_EMAIL\]/g, m.email ?? '[CONTACT_EMAIL]')
        .replace(/\[CONTACT_PHONE\]/g, m.phone ?? '[CONTACT_PHONE]')
        .replace(/\[PUBLISHER_NAME\]/g, m.publisher ?? m.name ?? '[PUBLISHER_NAME]')
    },
    [siteMeta]
  )

  const rawTemplate = language === 'fr' ? TERMS_FR : TERMS_EN
  const renderedText = replace(rawTemplate)

  const hasPlaceholders = useCallback(
    (text: string) =>
      /\[(?:SITE_NAME|EFFECTIVE_DATE|CONTACT_EMAIL|CONTACT_PHONE|PUBLISHER_NAME)\]/i.test(text),
    []
  )
  const showPlaceholderNote = hasPlaceholders(renderedText)

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

  const content = renderedText.split('\n').map((line, i) => {
    if (line.trim() === '') return <p key={i} className={styles.tosBodySpacer} aria-hidden="true" />
    return (
      <p key={i} className={styles.tosBodyParagraph}>
        {line}
      </p>
    )
  })

  const closeLabel = language === 'fr' ? 'Fermer' : 'Close'
  const placeholderNoteEn =
    'Please replace placeholders with your studio\'s legal details. The text above contains bracketed placeholders (e.g. [SITE_NAME], [CONTACT_EMAIL]). Update the site metadata or config so the modal shows your real information before publishing.'
  const placeholderNoteFr =
    'Veuillez remplacer les placeholders par les informations légales de votre studio. Le texte ci-dessus contient des placeholders entre crochets (ex. [SITE_NAME], [CONTACT_EMAIL]). Mettez à jour les métadonnées du site ou la config avant publication.'

  const modalContent = open ? (
    <div
      ref={overlayRef}
      className={styles.tosOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tos-modal-title"
      aria-describedby="tos-modal-content"
      data-testid="tos-modal"
    >
      <div
        className={styles.tosBackdrop}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).click()}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className={styles.tosDialog}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.tosHeader}>
          <h2 id="tos-modal-title" className={styles.tosTitle}>
            {language === 'fr' ? "Conditions d'utilisation" : 'Terms of Service'}
          </h2>
          <button
            ref={headerCloseRef}
            type="button"
            onClick={onClose}
            aria-label={language === 'fr' ? 'Fermer les conditions' : 'Close terms'}
            className={styles.tosHeaderClose}
          >
            ×
          </button>
        </header>

        <main
          id="tos-modal-content"
          className={styles.tosBody}
          tabIndex={-1}
        >
          {content}

          {showPlaceholderNote && (
            <div className={styles.tosPlaceholderNote} role="status">
              <p>
                <strong>
                  {language === 'fr'
                    ? 'Veuillez remplacer les placeholders par les informations de votre studio.'
                    : "Please replace placeholders with your studio's legal details."}
                </strong>
              </p>
              <p>{language === 'fr' ? placeholderNoteFr : placeholderNoteEn}</p>
            </div>
          )}
        </main>

        <footer className={styles.tosFooter}>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={styles.tosFooterBtn}
          >
            {closeLabel}
          </button>
        </footer>
      </div>
    </div>
  ) : null

  if (typeof document === 'undefined') {
    return null
  }
  return createPortal(modalContent, document.body)
}
