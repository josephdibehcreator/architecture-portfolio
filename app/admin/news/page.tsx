'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  listNews,
  deleteNews,
  publishNews,
  unpublishNews,
  type News,
  type ListNewsResponse
} from '@/services/admin/news'
import NewsTable from '@/components/admin/news-page/NewsTable'
import NewsForm from '@/components/admin/news-page/NewsForm'
import NewsToolbar from '@/components/admin/news-page/NewsToolbar'
import styles from './news.module.css'

type StatusFilter = 'all' | 'draft' | 'published'



export default function AdminNewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [selectedNews, setSelectedNews] = useState<Set<string>>(new Set())
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [sources, setSources] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('publishedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        order: sortOrder
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (searchQuery.trim()) {
        params.q = searchQuery.trim()
      }
      
      if (sourceFilter) {
        params.source = sourceFilter
      }

      const response = await listNews(params)
      
      if (response.success && response.data) {
        const responseData = response.data as ListNewsResponse
        
        if (responseData) {
          setNews(Array.isArray(responseData.data) ? responseData.data : [])
          
          if (responseData.pagination) {
            setPagination(prev => {
              const newPagination = {
                page: responseData.pagination.page || prev.page || 1,
                limit: responseData.pagination.limit || prev.limit || 25,
                total: responseData.pagination.total || 0,
                totalPages: responseData.pagination.totalPages || 0
              }
              if (
                newPagination.page !== prev.page ||
                newPagination.limit !== prev.limit ||
                newPagination.total !== prev.total ||
                newPagination.totalPages !== prev.totalPages
              ) {
                return newPagination
              }
              return prev
            })
          }
          
          setSources(Array.isArray(responseData.filters?.sources) ? responseData.filters.sources : [])
        } else {
          setNews([])
          setSources([])
          setError('Invalid response format from server')
        }
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load news')
        setNews([])
        setSources([])
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading news')
      console.error('News error:', err)
      setNews([])
      setSources([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [statusFilter, searchQuery, sourceFilter, sortBy, sortOrder])
  
  // Fetch news when pagination or filters change
  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchNews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, sourceFilter, pagination.page, pagination.limit, sortBy, sortOrder])

  const handleCreate = () => {
    setEditingNews(null)
    setIsFormOpen(true)
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async () => {
    setIsFormOpen(false)
    setEditingNews(null)
    await fetchNews()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news? This action cannot be undone.')) {
      return
    }
    
    setActionLoading(id)
    try {
      const response = await deleteNews(id)
      if (response.success) {
        await fetchNews()
        setSelectedNews(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      } else {
        alert(response.message || 'Failed to delete news')
      }
    } catch (err) {
      alert('An error occurred while deleting news')
      console.error('Delete error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await publishNews(id)
      if (response.success) {
        await fetchNews()
      } else {
        alert(response.message || 'Failed to publish news')
      }
    } catch (err) {
      alert('An error occurred while publishing news')
      console.error('Publish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await unpublishNews(id)
      if (response.success) {
        await fetchNews()
      } else {
        alert(response.message || 'Failed to unpublish news')
      }
    } catch (err) {
      alert('An error occurred while unpublishing news')
      console.error('Unpublish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkPublish = async () => {
    if (selectedNews.size === 0) return
    if (!confirm(`Are you sure you want to publish ${selectedNews.size} news item(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedNews).map(id => publishNews(id))
      await Promise.all(promises)
      await fetchNews()
      setSelectedNews(new Set())
    } catch (err) {
      alert('An error occurred while publishing news')
      console.error('Bulk publish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedNews.size === 0) return
    if (!confirm(`Are you sure you want to unpublish ${selectedNews.size} news item(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedNews).map(id => unpublishNews(id))
      await Promise.all(promises)
      await fetchNews()
      setSelectedNews(new Set())
    } catch (err) {
      alert('An error occurred while unpublishing news')
      console.error('Bulk unpublish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedNews.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedNews.size} news item(s)? This action cannot be undone.`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedNews).map(id => deleteNews(id))
      await Promise.all(promises)
      await fetchNews()
      setSelectedNews(new Set())
    } catch (err) {
      alert('An error occurred while deleting news')
      console.error('Bulk delete error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedNews(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedNews.size === news.length) {
      setSelectedNews(new Set())
    } else {
      setSelectedNews(new Set(news.map(n => n._id)))
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>News / Press</h1>
          <p className={styles.subtitle}>
            Manage your press coverage and news articles. Create, edit, publish, and organize your media mentions.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <NewsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        sources={sources}
        onCreateClick={handleCreate}
        selectedCount={selectedNews.size}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkDelete={handleBulkDelete}
        bulkLoading={bulkActionLoading}
      />

      <NewsTable
        news={news}
        loading={loading}
        selectedNews={selectedNews}
        onSelect={toggleSelect}
        onSelectAll={toggleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        actionLoading={actionLoading}
      />

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1 || loading}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            type="button"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages || loading}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}

      <NewsForm
        news={editingNews}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingNews(null)
        }}
        onSubmit={handleFormSubmit}
        loading={actionLoading !== null}
      />
    </div>
  )
}
