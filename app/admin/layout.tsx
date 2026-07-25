import type { Metadata } from 'next'
import AdminLayoutClient from '@/app/admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s',
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}