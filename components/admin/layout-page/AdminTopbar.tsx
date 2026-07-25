'use client'

import { LogOut, User } from 'lucide-react'
import { logoutAdmin } from '@/services/admin/admin'
import { useRouter } from 'next/navigation'
import styles from './AdminTopbar.module.css'

interface AdminTopbarProps {
  admin: { id: string; email: string; role: string } | null
}

export default function AdminTopbar({ admin }: AdminTopbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect on error
      router.push('/admin/login')
    }
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarContent}>
        <div className={styles.adminInfo}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.adminDetails}>
            <span className={styles.adminName}>{admin?.email || 'Admin'}</span>
            <span className={styles.adminRole}>{admin?.role || 'Administrator'}</span>
          </div>
        </div>
        
        <button 
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

