'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentAdmin } from '@/services/admin/admin'
import AdminSidebar from '@/components/admin/layout-page/AdminSidebar'
import AdminTopbar from '@/components/admin/layout-page/AdminTopbar'
import styles from './admin.module.css'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [admin, setAdmin] = useState<{ id: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const isAdminRoute = pathname?.startsWith('/admin')

    if (isAdminRoute) {
      document.body.classList.add('admin-page')
    } else {
      document.body.classList.remove('admin-page')
    }

    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [pathname])

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await getCurrentAdmin()
        if (response.success && response.data) {
          setIsAuthenticated(true)
          setAdmin(response.data.admin)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar currentPath={pathname} />
      <div className={styles.mainContent}>
        <AdminTopbar admin={admin} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}