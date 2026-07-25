'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './PrivacyPolicyModal.module.css'

export interface SitePrivacyMeta {
  name?: string
  publisher?: string
  legalForm?: string
  capital?: string
  siret?: string
  vat?: string
  city?: string
  regNumber?: string
  address?: string
  publicationDirector?: string
  email?: string
  phone?: string
  hosting?: {
    provider?: string
    address?: string
    contact?: string
  }
  effectiveDate?: string
  inquiryRetention?: string
  careerRetention?: string
}

const POLICY_TEMPLATE_EN = `Privacy Policy – [SITE_NAME]
Effective date: [EFFECTIVE_DATE]

1. Publisher
This website (the "Site") is published by [PUBLISHER_NAME] ([LEGAL_FORM], capital: [CAPITAL] €, SIRET/SIREN: [SIRET_NUMBER]), registered at the Trade and Companies Register of [CITY] under number [REG_NUMBER], whose registered office is located at [ADDRESS]. The publication director is [PUBLICATION_DIRECTOR].

2. Hosting
The Site is hosted by [HOSTING_PROVIDER], [HOSTING_ADDRESS] (contact: [HOSTING_CONTACT]).

3. Contact
For all questions about this policy and about how we process your personal data, please contact:
- Email: [CONTACT_EMAIL]
- Phone: [CONTACT_PHONE]
- Post: [ADDRESS]

4. Personal data we collect
We may collect personal data when you contact us, submit an inquiry, apply for a job, subscribe to a newsletter, or use certain Site features. Typical categories include:
- Identity and contact details (name, email, phone, postal address);
- Professional information (company name, job title) when relevant;
- Files you upload (CV, portfolio) and other documents;
- Technical data (IP address, device and browser information) collected automatically by analytics and server logs;
- Cookies and similar technologies as described below.

5. Legal bases for processing
We process personal data only when we have a lawful basis, including:
- Consent (e.g., when you agree to cookies or to receive marketing);
- Performance of a contract or pre-contractual measures (e.g., when you request a quote or consultation);
- Legal obligations (e.g., accounting, tax or regulatory retention requirements);
- Legitimate interests (e.g., maintaining site security, improving services), where such interests do not override your rights.

6. Purposes of processing
We process data for purposes including:
- Handling inquiries and project requests;
- Managing career applications and recruitment;
- Processing payments and billing (via our payment provider);
- Sending administrative messages and service-related communications;
- Analytics, site performance and security;
- Fulfilling legal and accounting obligations.

7. Recipients and transfers
Personal data may be shared with service providers performing functions on our behalf (hosting, email providers, payment processors, analytics, cloud storage). We ensure appropriate safeguards (data processing agreements, standard contractual clauses if needed) for transfers outside the EU/EEA.

8. Data retention
We retain personal data only as long as necessary for the purpose for which it was collected, and to meet statutory retention obligations. Typical retention periods:
- Contact and inquiry records: up to [INQUIRY_RETENTION_PERIOD] (e.g., 3 years) unless a longer legal obligation applies;
- Career applications: [CAREER_RETENTION_PERIOD] (e.g., 2 years) unless you request deletion;
- Accounting and billing data: in accordance with French law (usually 10 years).

9. Your rights
Under the GDPR you have the right to:
- Access your personal data;
- Request rectification or erasure;
- Request restriction of processing;
- Object to processing (including direct marketing);
- Request data portability (where applicable);
- Withdraw consent at any time (this does not affect processing prior to withdrawal).
To exercise your rights, contact [CONTACT_EMAIL]. You may also lodge a complaint with the CNIL (Commission Nationale de l'Informatique et des Libertés) at https://www.cnil.fr.

10. Cookies and similar technologies
We use strictly necessary (technical) cookies for essential site operation—for example, session, security, language preference and storage of your cookie choices. With your prior consent, we may also use audience measurement cookies (Google Analytics) to understand how the Site is used and to improve its performance. Analytics cookies are not set unless you have explicitly accepted them, and you can withdraw your consent at any time via the cookie banner, the cookie management controls on the Site, or your browser settings. We do not use advertising cookies or behavioural tracking cookies. A separate Cookie Policy (see link in the Site footer) describes in detail what we use and how you can manage cookies.

11. Security
We take appropriate technical and organizational measures to protect personal data against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.

12. Updates to this policy
We may update this policy from time to time. The effective date at the top will reflect the latest revision.`

const POLICY_TEMPLATE_FR = `Politique de confidentialité – [SITE_NAME]
Date d'entrée en vigueur : [EFFECTIVE_DATE]

1. Éditeur
Le présent site internet (le « Site ») est édité par [PUBLISHER_NAME] ([LEGAL_FORM], capital : [CAPITAL] €, SIRET/SIREN : [SIRET_NUMBER]), immatriculé(e) au Registre du Commerce et des Sociétés de [CITY] sous le numéro [REG_NUMBER], dont le siège social est situé à [ADDRESS]. Le directeur de la publication est [PUBLICATION_DIRECTOR].

2. Hébergement
Le Site est hébergé par [HOSTING_PROVIDER], [HOSTING_ADDRESS] (contact : [HOSTING_CONTACT]).

3. Contact
Pour toute question relative à la présente politique et au traitement de vos données personnelles, vous pouvez nous contacter :
- Courriel : [CONTACT_EMAIL]
- Téléphone : [CONTACT_PHONE]
- Adresse postale : [ADDRESS]

4. Données personnelles que nous collectons
Nous pouvons collecter des données personnelles lorsque vous nous contactez, soumettez une demande de projet, déposez une candidature, vous abonnez à une newsletter ou utilisez certaines fonctionnalités du Site. Les catégories de données peuvent notamment inclure :
- Données d'identité et de contact (nom, prénom, adresse e‑mail, numéro de téléphone, adresse postale) ;
- Informations professionnelles (nom de société, fonction) le cas échéant ;
- Fichiers que vous téléversez (CV, portfolio) et autres documents ;
- Données techniques (adresse IP, informations sur l’appareil et le navigateur) collectées automatiquement par les outils d’analyse et les journaux de serveur ;
- Cookies et technologies similaires, tels que décrits ci‑après.

5. Fondements juridiques du traitement
Nous ne traitons vos données personnelles que lorsqu’un fondement juridique le permet, notamment :
- Votre consentement (par exemple lorsque vous acceptez certains cookies ou des communications spécifiques) ;
- L’exécution d’un contrat ou de mesures précontractuelles (par exemple lorsque vous demandez un devis ou une consultation) ;
- Le respect d’obligations légales (par exemple obligations comptables, fiscales ou réglementaires de conservation) ;
- Nos intérêts légitimes (par exemple assurer la sécurité du Site, améliorer nos services), dans la mesure où ces intérêts ne portent pas atteinte à vos droits et libertés.

6. Finalités du traitement
Vos données sont traitées pour différentes finalités, notamment :
- Gérer les demandes de contact, d’informations et de projets ;
- Gérer les candidatures et le recrutement ;
- Gérer les paiements et la facturation (via notre prestataire de paiement) ;
- Envoyer des messages administratifs et des communications liées aux services ;
- Réaliser des analyses de performance du Site, des mesures d’audience et assurer la sécurité ;
- Satisfaire à nos obligations légales et comptables.

7. Destinataires et transferts
Les données personnelles peuvent être transmises à des prestataires amenés à agir pour notre compte (hébergement, prestataires e‑mail, prestataire de paiement, outils d’analyse, stockage cloud). Lorsque des transferts de données ont lieu en dehors de l’Union européenne/EEE, nous mettons en œuvre des garanties appropriées (accords de traitement des données, clauses contractuelles types le cas échéant).

8. Durée de conservation
Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées et afin de respecter les obligations légales de conservation. À titre indicatif :
- Les demandes de contact et d’inquiry : jusqu’à [INQUIRY_RETENTION_PERIOD] (par exemple 3 ans), sauf obligation légale de conservation plus longue ;
- Les candidatures : [CAREER_RETENTION_PERIOD] (par exemple 2 ans), sauf demande de suppression de votre part ;
- Les données de facturation et de comptabilité : conformément au droit français (généralement 10 ans).

9. Vos droits
Conformément au RGPD, vous disposez notamment des droits suivants :
- Droit d’accès à vos données personnelles ;
- Droit de rectification ou d’effacement ;
- Droit à la limitation du traitement ;
- Droit d’opposition au traitement (y compris à la prospection) ;
- Droit à la portabilité des données (lorsque cela est applicable) ;
- Droit de retirer votre consentement à tout moment (sans effet sur la licéité du traitement fondé sur le consentement avant son retrait).
Pour exercer vos droits, vous pouvez nous contacter à l’adresse [CONTACT_EMAIL]. Vous disposez également du droit d’introduire une réclamation auprès de la CNIL (Commission Nationale de l’Informatique et des Libertés) via https://www.cnil.fr.

10. Cookies et technologies similaires
Nous utilisons des cookies techniques strictement nécessaires au fonctionnement essentiel du Site (par exemple pour la session, la sécurité, la mémorisation de la langue et de vos choix en matière de cookies). Avec votre consentement préalable, nous pouvons également utiliser des cookies de mesure d’audience (Google Analytics) afin de comprendre comment le Site est utilisé et d’en améliorer les performances. Ces cookies d’analyse ne sont pas déposés sans votre accord explicite, et vous pouvez retirer votre consentement à tout moment via la bannière de cookies, les contrôles de gestion des cookies présents sur le Site, ou les paramètres de votre navigateur. Nous n’utilisons pas de cookies publicitaires ni de cookies de suivi comportemental. Une Politique de cookies distincte (accessible depuis le pied de page du Site) décrit en détail les cookies utilisés et les moyens de les gérer.

11. Sécurité
Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la destruction accidentelle ou illicite, la perte, l’altération ou la divulgation non autorisée.

12. Modifications de la présente politique
Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre. La date d’entrée en vigueur indiquée en haut du document reflètera la dernière version en vigueur.`

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  )
}

export default function PrivacyPolicyModal({
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
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const replace = useCallback(
    (str: string) => {
      const m = siteMeta
      const h = siteMeta.hosting
      return str
        .replace(/\[SITE_NAME\]/g, m.name ?? '[SITE_NAME]')
        .replace(/\[EFFECTIVE_DATE\]/g, m.effectiveDate ?? '[EFFECTIVE_DATE]')
        .replace(/\[PUBLISHER_NAME\]/g, m.publisher ?? m.name ?? '[PUBLISHER_NAME]')
        .replace(/\[LEGAL_FORM\]/g, m.legalForm ?? '[legal_form]')
        .replace(/\[CAPITAL\]/g, m.capital ?? '[CAPITAL]')
        .replace(/\[SIRET_NUMBER\]/g, m.siret ?? '[SIRET_NUMBER]')
        .replace(/\[CITY\]/g, m.city ?? '[CITY]')
        .replace(/\[REG_NUMBER\]/g, m.regNumber ?? '[REG_NUMBER]')
        .replace(/\[ADDRESS\]/g, m.address ?? '[ADDRESS]')
        .replace(/\[PUBLICATION_DIRECTOR\]/g, m.publicationDirector ?? '[PUBLICATION_DIRECTOR]')
        .replace(/\[HOSTING_PROVIDER\]/g, h?.provider ?? '[HOSTING_PROVIDER]')
        .replace(/\[HOSTING_ADDRESS\]/g, h?.address ?? '[HOSTING_ADDRESS]')
        .replace(/\[HOSTING_CONTACT\]/g, h?.contact ?? '[HOSTING_CONTACT]')
        .replace(/\[CONTACT_EMAIL\]/g, m.email ?? '[CONTACT_EMAIL]')
        .replace(/\[CONTACT_PHONE\]/g, m.phone ?? '[CONTACT_PHONE]')
        .replace(/\[INQUIRY_RETENTION_PERIOD\]/g, m.inquiryRetention ?? '3 years')
        .replace(/\[CAREER_RETENTION_PERIOD\]/g, m.careerRetention ?? '2 years')
    },
    [siteMeta]
  )

  const hasPlaceholders = (text: string) =>
    /\[(?:SITE_NAME|EFFECTIVE_DATE|PUBLISHER_NAME|LEGAL_FORM|CAPITAL|SIRET_NUMBER|CITY|REG_NUMBER|ADDRESS|PUBLICATION_DIRECTOR|HOSTING_PROVIDER|HOSTING_ADDRESS|HOSTING_CONTACT|CONTACT_EMAIL|CONTACT_PHONE)\]/i.test(text)

  const rawTemplate = language === 'fr' ? POLICY_TEMPLATE_FR : POLICY_TEMPLATE_EN
  const renderedText = replace(rawTemplate)
  const showPlaceholderNote = hasPlaceholders(renderedText)

  useEffect(() => {
    if (open) {
      previouslyFocused.current =
        (triggerRef?.current as HTMLElement) ?? (document.activeElement as HTMLElement)
      document.body.style.overflow = 'hidden'
      const timeoutId = setTimeout(() => closeButtonRef.current?.focus(), 0)

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
    if (line.trim() === '') return <p key={i} className={styles.privacyBodySpacer} aria-hidden="true" />
    return (
      <p key={i} className={styles.privacyBodyParagraph}>
        {line}
      </p>
    )
  })

  const modalContent = open ? (
    <div
      ref={overlayRef}
      className={styles.privacyOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      aria-describedby="privacy-modal-content"
    >
      <div
        className={styles.privacyBackdrop}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).click()}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className={styles.privacyDialog}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.privacyHeader}>
          <h2 id="privacy-modal-title" className={styles.privacyTitle}>
            {language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
          </h2>
        </header>

        <main
          id="privacy-modal-content"
          className={styles.privacyBody}
          tabIndex={-1}
        >
          {content}

          {showPlaceholderNote && (
            <div className={styles.privacyPlaceholderNote}>
              <p>
                <strong>
                  {language === 'fr'
                    ? 'Veuillez remplacer les placeholders par les informations légales de votre studio.'
                    : "Please replace placeholders with your studio's legal details."}
                </strong>
              </p>
              <p>
                {language === 'fr'
                  ? "Le texte ci-dessus contient des placeholders entre crochets (par exemple [SITE_NAME], [SIRET_NUMBER], [CONTACT_EMAIL]). Mettez à jour les métadonnées du site ou la configuration afin que la modale affiche vos informations juridiques réelles avant publication."
                  : 'The policy above contains bracketed placeholders (e.g. [SITE_NAME], [SIRET_NUMBER], [CONTACT_EMAIL]). Update the site metadata or config so the modal shows your real legal information before publishing.'}
              </p>
            </div>
          )}
        </main>

        <footer className={styles.privacyFooter}>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={language === 'fr' ? 'Fermer la politique de confidentialité' : 'Close privacy policy'}
            className={styles.privacyFooterBtn}
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
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
