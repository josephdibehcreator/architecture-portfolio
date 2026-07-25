/**
 * Site metadata for legal pages (Privacy Policy, etc.).
 * Replace placeholders with your studio's legal details.
 * Values here are used to fill the Privacy Policy modal; missing values show as [PLACEHOLDER].
 */
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

export const sitePrivacyMeta: SitePrivacyMeta = {
  name: 'PROJECTS BY JOSEPH DIBEH',
  publisher: 'PROJECTS BY JOSEPH DIBEH',
  email: 'by.joseph.dibeh@gmail.com',
  phone: '+33 6 66 00 32 04',
  
  legalForm: 'SAS (société par actions simplifiée)',
  capital: '1,000',
  siret: '940 137 151 00012',
  vat: 'FR83 940 137 151',
  city: 'Suresnes',
  // If you later get the exact RCS number, replace this.
  // For now we use SIREN as the identifier.
  regNumber: '940 137 151',
  address: "5 RUE HONORÉ D'ESTIENNE D'ORVES, 92150 SURESNES, France",
  publicationDirector: 'Joseph Dibeh',
  hosting: { provider: 'Vercel Inc.', address: '440 N Barranca Ave #4133, Covina, CA 91723', contact: 'https://vercel.com/contact' },
  effectiveDate: new Date().toISOString().slice(0, 10),
  inquiryRetention: '3 years',
  careerRetention: '2 years',
}
