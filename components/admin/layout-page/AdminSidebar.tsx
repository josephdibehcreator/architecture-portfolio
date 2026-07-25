'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  Inbox, 
  Calendar,
  Briefcase,
  FileText,
  Newspaper,
  Menu,
  X,
  User,
  FileCheck
} from 'lucide-react'
import { useState } from 'react'
import styles from './AdminSidebar.module.css'

interface AdminSidebarProps {
  currentPath: string
}

export default function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban, disabled: false },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, disabled: false },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox, disabled: false },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar, disabled: false },
    { href: '/admin/careers', label: 'Careers', icon: Briefcase, disabled: false },
    { href: '/admin/applications', label: 'Applications', icon: FileCheck, disabled: false },
    { href: '/admin/blogs', label: 'Blogs', icon: FileText, disabled: false },
    { href: '/admin/news', label: 'News', icon: Newspaper, disabled: false },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <button 
        className={styles.mobileToggle}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h2 className={styles.logoText}>Admin Panel</h2>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon
            // Check if current path matches or starts with the href (for nested routes)
            const isActive = currentPath === item.href || currentPath?.startsWith(item.href + '/')
            
            if (item.disabled) {
              return (
                <div 
                  key={item.href} 
                  className={`${styles.navItem} ${styles.disabled}`}
                  title="Coming soon"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className={styles.bottom}>
          <Link
            href="/admin/profile"
            className={`${styles.navItem} ${currentPath === '/admin/profile' ? styles.active : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Edit profile"
          >
            <User size={20} />
            <span>Edit profile</span>
          </Link>
        </div>
      </aside>
      
      {mobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

