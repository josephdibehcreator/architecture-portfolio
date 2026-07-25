'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, type DashboardStats } from '@/services/admin/admin'
import HomepageStatsModal from '@/components/admin/dashboard-page/HomepageStatsModal'
import { 
  FolderKanban, 
  MessageSquare, 
  Inbox, 
  Calendar,
  FileText,
  Newspaper,
  Briefcase,
  Euro,
  TrendingUp
} from 'lucide-react'
import styles from './dashboard.module.css'



export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats()
        if (response.success && response.data) {
          setStats(response.data)
        } else {
          setError(response.message || 'Failed to load dashboard data')
        }
      } catch (err) {
        setError('An error occurred while loading dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.counts.projects,
      icon: FolderKanban,
      color: '#3B82F6'
    },
    {
      label: 'Total Testimonials',
      value: stats.counts.testimonials,
      icon: MessageSquare,
      color: '#10B981'
    },
    {
      label: 'Total Inquiries',
      value: stats.counts.inquiries,
      icon: Inbox,
      color: '#8B5CF6'
    },
    {
      label: 'Paid Bookings',
      value: stats.counts.paidBookings,
      icon: Calendar,
      color: '#F59E0B'
    },
    {
      label: 'Blog Posts',
      value: stats.counts.blogPosts,
      icon: FileText,
      color: '#EC4899'
    },
    {
      label: 'News Posts',
      value: stats.counts.newsPosts,
      icon: Newspaper,
      color: '#06B6D4'
    },
    {
      label: 'Career Applications',
      value: stats.counts.careerApplications,
      icon: Briefcase,
      color: '#6366F1'
    }
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Overview of your portfolio data</p>
        </div>
        <button
          type="button"
          className={styles.headerActionButton}
          onClick={() => setIsStatsModalOpen(true)}
        >
          Edit Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>{card.label}</p>
                <p className={styles.statValue}>{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue Card */}
      <div className={styles.revenueCard}>
        <div className={styles.revenueHeader}>
          <div className={styles.revenueIcon}>
            <Euro size={24} />
          </div>
          <div>
            <h3 className={styles.revenueTitle}>Stripe Revenue</h3>
            <p className={styles.revenueAmount}>{formatCurrency(stats.stripe.totalRevenue)}</p>
          </div>
        </div>
        <div className={styles.revenueDetails}>
          <div className={styles.revenueItem}>
            <span className={styles.revenueLabel}>Last Payment Status:</span>
            <span className={styles.revenueValue}>
              {stats.stripe.lastPaymentStatus || 'N/A'}
            </span>
          </div>
          <div className={styles.revenueItem}>
            <span className={styles.revenueLabel}>Last Payment Date:</span>
            <span className={styles.revenueValue}>
              {formatDate(stats.stripe.lastPaymentDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.activityGrid}>
        {/* Recent Inquiries */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Inquiries</h3>
            <Inbox size={20} className={styles.activityIcon} />
          </div>
          <div className={styles.activityList}>
            {stats.recentActivity.inquiries.length > 0 ? (
              stats.recentActivity.inquiries.map((inquiry) => (
                <div key={inquiry._id} className={styles.activityItem}>
                  <div className={styles.activityItemContent}>
                    <p className={styles.activityItemName}>
                      {inquiry.firstName} {inquiry.lastName}
                    </p>
                    <p className={styles.activityItemEmail}>{inquiry.email}</p>
                  </div>
                  <div className={styles.activityItemMeta}>
                    <span className={`${styles.statusBadge} ${inquiry.paymentStatus === 'paid' ? styles.statusPaid : styles.statusPending}`}>
                      {inquiry.paymentStatus || inquiry.status}
                    </span>
                    <span className={styles.activityItemDate}>
                      {formatDate(inquiry.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No recent inquiries</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Bookings</h3>
            <Calendar size={20} className={styles.activityIcon} />
          </div>
          <div className={styles.activityList}>
            {stats.recentActivity.bookings.length > 0 ? (
              stats.recentActivity.bookings.map((booking) => (
                <div key={booking._id} className={styles.activityItem}>
                  <div className={styles.activityItemContent}>
                    <p className={styles.activityItemName}>
                      {booking.firstName} {booking.lastName}
                    </p>
                    <p className={styles.activityItemEmail}>{booking.email}</p>
                  </div>
                  <div className={styles.activityItemMeta}>
                    {booking.amount && (
                      <span className={styles.amountBadge}>
                        {formatCurrency(booking.amount / 100)}
                      </span>
                    )}
                    <span className={styles.activityItemDate}>
                      {formatDate(booking.paidAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No recent bookings</p>
            )}
          </div>
        </div>
      </div>

      <HomepageStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />
    </div>
  )
}

