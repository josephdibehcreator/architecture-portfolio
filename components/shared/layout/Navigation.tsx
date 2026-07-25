'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './Navigation.module.css'

export default function Navigation() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)
  const mobileServicesArrowRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Pages that have InquirySection
  const pagesWithInquiry = ['/', '/about', '/projects', '/services']
  
  // Get the inquiry link based on current page
  const getInquiryLink = () => {
    if (pagesWithInquiry.includes(pathname)) {
      return `${pathname}#inquiry`
    }
    return '/#inquiry' // Default to home page inquiry section
  }

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen
    setMobileMenuOpen(newState)
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = newState ? 'hidden' : ''
    }
    // Close services dropdown when closing mobile menu
    if (!newState) {
      setServicesDropdownOpen(false)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setServicesDropdownOpen(false)
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = ''
    }
  }

  // Close dropdowns when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isMobile = window.innerWidth < 768
      
      // Skip if mobile - mobile dropdowns are controlled by button clicks only
      if (isMobile) return
      
      // Check for desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
      
      // Check for desktop services dropdown
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(target)) {
        setServicesDropdownOpen(false)
      }
    }

    // Only add listener for desktop dropdowns
    if (window.innerWidth >= 768 && (dropdownOpen || servicesDropdownOpen)) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, servicesDropdownOpen])

  return (
    <nav className={styles.nav}>
      <div className="container-fluid">
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Image
              src="https://res.cloudinary.com/dszlnbdap/image/upload/v1774436048/logo-trans-without-text_c9z8z2.png"
              alt="Joseph Dibeh"
              width={80}
              height={80}
              className={styles.logoImage}
              priority
            />
          </Link>

          <div className={styles.desktopMenu}>
            <Link href="/" className="hover-trigger">
              {t('nav_home')}
            </Link>
            <Link href="/about" className="hover-trigger">
              {t('nav_about')}
            </Link>
            <div className={styles.dropdownContainer} ref={servicesDropdownRef}>
              <div className={styles.servicesDropdownWrapper}>
                <Link href="/services" className={`${styles.servicesLink} hover-trigger`}>
                  {t('nav_services')}
                </Link>
                <button
                  className={`${styles.dropdownBtn} ${styles.servicesDropdownBtn} hover-trigger`}
                  onClick={(e) => {
                    e.preventDefault()
                    setServicesDropdownOpen(!servicesDropdownOpen)
                  }}
                  aria-label="Services menu"
                >
                  <ChevronDown size={14} className={servicesDropdownOpen ? styles.chevronRotated : ''} />
                </button>
              </div>
              {servicesDropdownOpen && (
                <div className={styles.dropdown}>
                  <Link href="/services/architecture" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_architecture_title')}
                  </Link>
                  <Link href="/services/interior-design" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_interior_title')}
                  </Link>
                  <Link href="/services/landscape" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_landscape_title')}
                  </Link>
                  <Link href="/services/3d-scanning" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_3d_scanning_title')}
                  </Link>
                  <Link href="/services/photography" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_photography_title')}
                  </Link>
                  <Link href="/services/preliminary-declaration-approvals" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_permits_title')}
                  </Link>
                  <Link href="/services/3d-printing" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_3d_printing_title')}
                  </Link>
                  <Link href="/services/branding" onClick={() => setServicesDropdownOpen(false)}>
                    {t('service_branding_title')}
                  </Link>
                </div>
              )}
            </div>
            <Link href="/projects" className="hover-trigger">
              {t('nav_projects')}
            </Link>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                className={`${styles.dropdownBtn} hover-trigger`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Others menu"
              >
                {t('nav_others')}
                <ChevronDown size={14} className={dropdownOpen ? styles.chevronRotated : ''} />
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link href="/#career" onClick={() => setDropdownOpen(false)}>
                    {t('nav_careers')}
                  </Link>
                  <Link href="/news" onClick={() => setDropdownOpen(false)}>
                    {t('nav_blogs_news')}
                  </Link>
                </div>
              )}
            </div>
            <Link href={getInquiryLink()} className={`${styles.inquireBtn} hover-trigger`}>
              {t('nav_inquire')}
            </Link>
          </div>

          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          <Link href="/" onClick={closeMobileMenu}>
            {t('nav_home')}
          </Link>
          <Link href="/about" onClick={closeMobileMenu}>
            {t('nav_about')}
          </Link>
          <div className={styles.mobileServicesContainer}>
            <Link 
              href="/services" 
              onClick={closeMobileMenu}
              className={styles.mobileServicesLink}
            >
              {t('nav_services')}
            </Link>
            <button
              ref={mobileServicesArrowRef}
              className={styles.mobileServicesArrow}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Toggle the dropdown state
                setServicesDropdownOpen((prev) => !prev)
              }}
              onMouseDown={(e) => {
                // Prevent the click outside handler from firing
                e.stopPropagation()
              }}
              aria-label="Toggle services menu"
              aria-expanded={servicesDropdownOpen}
              type="button"
            >
              <ChevronDown size={16} className={servicesDropdownOpen ? styles.chevronRotated : ''} />
            </button>
          </div>
          {servicesDropdownOpen && (
            <div className={styles.mobileDropdown}>
              <Link href="/services/architecture" onClick={closeMobileMenu}>
                {t('service_architecture_title')}
              </Link>
              <Link href="/services/interior-design" onClick={closeMobileMenu}>
                {t('service_interior_title')}
              </Link>
              <Link href="/services/landscape" onClick={closeMobileMenu}>
                {t('service_landscape_title')}
              </Link>
              <Link href="/services/3d-scanning" onClick={closeMobileMenu}>
                {t('service_3d_scanning_title')}
              </Link>
              <Link href="/services/photography" onClick={closeMobileMenu}>
                {t('service_photography_title')}
              </Link>
              <Link href="/services/preliminary-declaration-approvals" onClick={closeMobileMenu}>
                {t('service_permits_title')}
              </Link>
              <Link href="/services/3d-printing" onClick={closeMobileMenu}>
                {t('service_3d_printing_title')}
              </Link>
              <Link href="/services/branding" onClick={closeMobileMenu}>
                {t('service_branding_title')}
              </Link>
            </div>
          )}
          <Link href="/projects" onClick={closeMobileMenu}>
            {t('nav_projects')}
          </Link>
          <Link href="/#career" onClick={closeMobileMenu}>
            {t('nav_careers')}
          </Link>
          <Link href="/news" onClick={closeMobileMenu}>
            {t('nav_blogs_news')}
          </Link>
          <Link href={getInquiryLink()} onClick={closeMobileMenu}>
            {t('nav_inquire')}
          </Link>
        </div>
      </div>
    </nav>
  )
}

