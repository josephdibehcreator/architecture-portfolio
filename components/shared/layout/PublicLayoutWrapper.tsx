'use client'

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import AutoCadCursor from '@/styles/UI/AutoCadCursor'
import Navigation from '@/components/shared/layout/Navigation'
import Footer from '@/components/shared/layout/Footer'
import BackgroundGrid from '@/styles/UI/BackgroundGrid'
import LanguageUpdater from '@/components/shared/LanguageUpdater'
import CookieBanner from '@/components/shared/legal-scripts/CookieBanner'
import CookiePolicyModal from '@/components/shared/legal-scripts/CookiePolicyModal'
import { sitePrivacyMeta } from '@/config/siteMetadata'

export default function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isProjectDetailPage = pathname?.startsWith('/projects/') && pathname !== '/projects'
  const [showCookiePolicy, setShowCookiePolicy] = useState(false)
  const cookiePolicyTriggerRef = useRef<HTMLElement | null>(null)

  const openCookiePolicy = (el: HTMLElement | null) => {
    cookiePolicyTriggerRef.current = el
    setShowCookiePolicy(true)
  }

  // Don't render public components on admin routes
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <LanguageUpdater />
      <AutoCadCursor />
      <BackgroundGrid />
      <Navigation />
      <main className={`z-10 relative ${isProjectDetailPage ? 'page-with-header-offset' : ''}`}>
        {children}
      </main>
      <Footer openCookiePolicy={openCookiePolicy} />
      <CookieBanner onOpenCookiePolicy={openCookiePolicy} />
      <CookiePolicyModal
        open={showCookiePolicy}
        onClose={() => setShowCookiePolicy(false)}
        siteMeta={sitePrivacyMeta}
        triggerRef={cookiePolicyTriggerRef}
      />
    </>
  )
}

