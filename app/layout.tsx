import type { Metadata } from 'next'
import Script from 'next/script'
import { Montserrat, Space_Mono } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.css'
import PublicLayoutWrapper from '@/components/shared/layout/PublicLayoutWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'
import GoogleAnalytics from '@/components/shared/GoogleAnalytics'
import { socialLinks } from '@/config/socialLinks'
import { getSiteUrl } from '@/utils/site'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Dibeh Architecture | Paris, French Riviera & Beirut',
     template: '%s | Dibeh Architecture'
  },
  description:
  'Dibeh Architecture offers architecture, interior design, landscape, permits, 3D printing, and branding services in Paris, the French Riviera (Côte d’Azur), and Beirut.',
  authors: [{ name: 'Joseph Dibeh' }],
  creator: 'Joseph Dibeh',
  publisher: 'Dibeh Architecture',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774436048/logo-trans-without-text_c9z8z2.png',
    shortcut: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774436048/logo-trans-without-text_c9z8z2.png',
    apple: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774436048/logo-trans-without-text_c9z8z2.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'en_GB'],
    url: getSiteUrl(),
    siteName: 'Dibeh Architecture',
    title: 'Dibeh Architecture | Paris, French Riviera & Beirut',
    description:
      'High-end architecture, interiors, landscape, permits, 3D printing, and branding services across Paris, the French Riviera (Côte d’Azur), and Beirut.',
    images: [
      {
        url: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
        width: 1200,
        height: 630,
        alt: 'Dibeh Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dibeh Architecture | Paris, French Riviera & Beirut',
    description:
      'High-end architecture, interiors, landscape, permits, 3D printing, and branding services across Paris, the French Riviera (Côte d’Azur), and Beirut.',
    images: ['https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=1nY6N0-dfR-jrDJrUjpQ-EeYLY6VH9f-_u7X8I_LU-4',
  },
  category: 'architecture',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Dibeh Architecture',
  founder: {
    '@type': 'Person',
    name: 'Joseph Dibeh',
    url: `${getSiteUrl()}/about`,
      image: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
  },
  url: getSiteUrl(),
  logo: 'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
  image:
    'https://res.cloudinary.com/dszlnbdap/image/upload/v1774427352/logo-without-text_u2gkgb.png',
  email: 'contact@dibeh-architecture.com',
  telephone: '+33 6 66 00 32 04',
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'French Riviera',
      addressRegion: 'Côte d’Azur',
      addressCountry: 'FR',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Beirut',
      addressCountry: 'LB',
    },
  ],
  areaServed: [
    {
      '@type': 'Place',
      name: 'Paris',
    },
    {
      '@type': 'Place',
      name: 'French Riviera',
    },
    {
      '@type': 'Place',
      name: 'Beirut',
    },
  ],
  sameAs: [socialLinks.instagram, socialLinks.linkedin, socialLinks.tiktok],
  description:
    'Architecture studio offering architecture, interior design, landscape, permits, 3D printing, and branding services in Paris, the French Riviera, and Beirut.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${montserrat.variable} ${spaceMono.variable} antialiased`}>
        <Script
          id="language-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check localStorage first (synchronous) - this is the source of truth
                  var savedLang = localStorage.getItem('language');
                  if (savedLang === 'en' || savedLang === 'fr') {
                    // Set immediately before React hydrates
                    document.documentElement.lang = savedLang;
                    document.documentElement.setAttribute('lang', savedLang);
                    document.documentElement.setAttribute('data-initial-lang', savedLang);
                    // Also set a class to help with styling if needed
                    document.documentElement.className = document.documentElement.className.replace(/\\blang-\\w+\\b/g, '');
                    document.documentElement.classList.add('lang-' + savedLang);
                    return;
                  }
                  
                  // If no saved language, default to English
                  // The API call will update it later if needed, but we start with English
                  // to avoid the French flash for non-French users
                  var initialLang = 'en';
                  document.documentElement.lang = initialLang;
                  document.documentElement.setAttribute('lang', initialLang);
                  document.documentElement.setAttribute('data-initial-lang', initialLang);
                  document.documentElement.className = document.documentElement.className.replace(/\\blang-\\w+\\b/g, '');
                  document.documentElement.classList.add('lang-' + initialLang);
                } catch (e) {
                  // Fallback to English if anything fails
                  var fallbackLang = 'en';
                  document.documentElement.lang = fallbackLang;
                  document.documentElement.setAttribute('lang', fallbackLang);
                  document.documentElement.setAttribute('data-initial-lang', fallbackLang);
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <LanguageProvider>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </LanguageProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}

