'use client'


import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  listBlogs,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  type Blog,
  type ListBlogsResponse
} from '@/services/admin/blogs'
import BlogsTable from '@/components/admin/blog-page/BlogsTable'
import BlogsToolbar from '@/components/admin/blog-page/BlogsToolbar'
import styles from './blogs.module.css'

const BlogForm = dynamic(() => import('@/components/admin/blog-page/BlogForm'), {
  ssr: false,
})

type StatusFilter = 'all' | 'draft' | 'published'



export default function AdminBlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set())
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [categories, setCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchBlogs = async () => {
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
      
      if (categoryFilter) {
        params.category = categoryFilter
      }

      const response = await listBlogs(params)
      
      if (response.success && response.data) {
        const responseData = response.data as ListBlogsResponse
        
        if (responseData) {
          setBlogs(Array.isArray(responseData.data) ? responseData.data : [])
          
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
          
          setCategories(Array.isArray(responseData.filters?.categories) ? responseData.filters.categories : [])
        } else {
          setBlogs([])
          setCategories([])
          setError('Invalid response format from server')
        }
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load blogs')
        setBlogs([])
        setCategories([])
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading blogs')
      console.error('Blogs error:', err)
      setBlogs([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [statusFilter, searchQuery, categoryFilter, sortBy, sortOrder])
  
  // Fetch blogs when pagination or filters change
  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchBlogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, categoryFilter, pagination.page, pagination.limit, sortBy, sortOrder])

  const handleCreate = () => {
    setEditingBlog(null)
    setIsFormOpen(true)
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async () => {
    // Form handles API call internally with FormData
    // Just close modal and refresh list
    setIsFormOpen(false)
    setEditingBlog(null)
    await fetchBlogs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return
    }
    
    setActionLoading(id)
    try {
      const response = await deleteBlog(id)
      if (response.success) {
        await fetchBlogs()
        setSelectedBlogs(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      } else {
        alert(response.message || 'Failed to delete blog')
      }
    } catch (err) {
      alert('An error occurred while deleting blog')
      console.error('Delete error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await publishBlog(id)
      if (response.success) {
        await fetchBlogs()
      } else {
        alert(response.message || 'Failed to publish blog')
      }
    } catch (err) {
      alert('An error occurred while publishing blog')
      console.error('Publish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await unpublishBlog(id)
      if (response.success) {
        await fetchBlogs()
      } else {
        alert(response.message || 'Failed to unpublish blog')
      }
    } catch (err) {
      alert('An error occurred while unpublishing blog')
      console.error('Unpublish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkPublish = async () => {
    if (selectedBlogs.size === 0) return
    if (!confirm(`Are you sure you want to publish ${selectedBlogs.size} blog(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedBlogs).map(id => publishBlog(id))
      await Promise.all(promises)
      await fetchBlogs()
      setSelectedBlogs(new Set())
    } catch (err) {
      alert('An error occurred while publishing blogs')
      console.error('Bulk publish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedBlogs.size === 0) return
    if (!confirm(`Are you sure you want to unpublish ${selectedBlogs.size} blog(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedBlogs).map(id => unpublishBlog(id))
      await Promise.all(promises)
      await fetchBlogs()
      setSelectedBlogs(new Set())
    } catch (err) {
      alert('An error occurred while unpublishing blogs')
      console.error('Bulk unpublish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedBlogs.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedBlogs.size} blog(s)? This action cannot be undone.`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedBlogs).map(id => deleteBlog(id))
      await Promise.all(promises)
      await fetchBlogs()
      setSelectedBlogs(new Set())
    } catch (err) {
      alert('An error occurred while deleting blogs')
      console.error('Bulk delete error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedBlogs(prev => {
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
    if (selectedBlogs.size === blogs.length) {
      setSelectedBlogs(new Set())
    } else {
      setSelectedBlogs(new Set(blogs.map(b => b._id)))
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Blogs</h1>
          <p className={styles.subtitle}>
            Manage your blog posts. Create, edit, publish, and organize your articles.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <BlogsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        onCreateClick={handleCreate}
        selectedCount={selectedBlogs.size}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkDelete={handleBulkDelete}
        bulkLoading={bulkActionLoading}
      />

      <BlogsTable
        blogs={blogs}
        loading={loading}
        selectedBlogs={selectedBlogs}
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

      <BlogForm
        blog={editingBlog}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBlog(null)
        }}
        onSubmit={handleFormSubmit}
        loading={actionLoading !== null}
      />
    </div>
  )
}
