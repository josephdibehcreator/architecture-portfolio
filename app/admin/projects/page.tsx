'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  unpublishProject,
  type Project,
  type CreateProjectData,
  type ListProjectsResponse
} from '@/services/admin/projects'
import ProjectsTable from '@/components/admin/project-page/ProjectsTable'
import ProjectForm from '@/components/admin/project-page/ProjectForm'
import ProjectsToolbar from '@/components/admin/project-page/ProjectsToolbar'
import styles from './projects.module.css'

type StatusFilter = 'all' | 'draft' | 'published'



export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [tags, setTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchProjects = async () => {
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
      
      if (tagFilter) {
        params.tag = tagFilter
      }

      const response = await listProjects(params)
      
      if (response.success && response.data) {
        const responseData = response.data as ListProjectsResponse
        
        if (responseData) {
          setProjects(Array.isArray(responseData.data) ? responseData.data : [])
          
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
          
          setTags(Array.isArray(responseData.filters?.tags) ? responseData.filters.tags : [])
        } else {
          setProjects([])
          setTags([])
          setError('Invalid response format from server')
        }
      } else {
        if (response.error && (response.error.includes('401') || response.error.includes('Authentication'))) {
          router.push('/admin/login')
          return
        }
        setError(response.message || 'Failed to load projects')
        setProjects([])
        setTags([])
      }
    } catch (err: any) {
      if (err.message?.includes('401') || err.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('An error occurred while loading projects')
      console.error('Projects error:', err)
      setProjects([])
      setTags([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [statusFilter, searchQuery, tagFilter, sortBy, sortOrder])
  
  // Fetch projects when pagination or filters change
  useEffect(() => {
    if (pagination.page > 0 && pagination.limit > 0) {
      fetchProjects()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, tagFilter, pagination.page, pagination.limit, sortBy, sortOrder])

  const handleCreate = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async () => {
    // Form handles API call internally with FormData
    // Just close modal and refresh list
    setIsFormOpen(false)
    setEditingProject(null)
    await fetchProjects()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }
    
    setActionLoading(id)
    try {
      const response = await deleteProject(id)
      if (response.success) {
        await fetchProjects()
        setSelectedProjects(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      } else {
        alert(response.message || 'Failed to delete project')
      }
    } catch (err) {
      alert('An error occurred while deleting project')
      console.error('Delete error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await publishProject(id)
      if (response.success) {
        await fetchProjects()
      } else {
        alert(response.message || 'Failed to publish project')
      }
    } catch (err) {
      alert('An error occurred while publishing project')
      console.error('Publish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await unpublishProject(id)
      if (response.success) {
        await fetchProjects()
      } else {
        alert(response.message || 'Failed to unpublish project')
      }
    } catch (err) {
      alert('An error occurred while unpublishing project')
      console.error('Unpublish error:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkPublish = async () => {
    if (selectedProjects.size === 0) return
    if (!confirm(`Are you sure you want to publish ${selectedProjects.size} project(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedProjects).map(id => publishProject(id))
      await Promise.all(promises)
      await fetchProjects()
      setSelectedProjects(new Set())
    } catch (err) {
      alert('An error occurred while publishing projects')
      console.error('Bulk publish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedProjects.size === 0) return
    if (!confirm(`Are you sure you want to unpublish ${selectedProjects.size} project(s)?`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedProjects).map(id => unpublishProject(id))
      await Promise.all(promises)
      await fetchProjects()
      setSelectedProjects(new Set())
    } catch (err) {
      alert('An error occurred while unpublishing projects')
      console.error('Bulk unpublish error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedProjects.size} project(s)? This action cannot be undone.`)) return
    
    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedProjects).map(id => deleteProject(id))
      await Promise.all(promises)
      await fetchProjects()
      setSelectedProjects(new Set())
    } catch (err) {
      alert('An error occurred while deleting projects')
      console.error('Bulk delete error:', err)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProjects(prev => {
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
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(projects.map(p => p._id)))
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            Manage your portfolio projects. Create, edit, publish, and organize your work.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <ProjectsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        tags={tags}
        onCreateClick={handleCreate}
        selectedCount={selectedProjects.size}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkDelete={handleBulkDelete}
        bulkLoading={bulkActionLoading}
      />

      <ProjectsTable
        projects={projects}
        loading={loading}
        selectedProjects={selectedProjects}
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

      <ProjectForm
        project={editingProject}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProject(null)
        }}
        onSubmit={handleFormSubmit}
        loading={actionLoading !== null}
      />
    </div>
  )
}
