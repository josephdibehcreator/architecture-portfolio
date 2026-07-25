/**
 * Admin Blogs API service
 * Handles all API calls related to blog management (admin only)
 */

import { get, post, put, del, patch, ApiResponse, getApiBaseUrl } from '../api'

export interface Blog {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  coverImage: {
    url: string
    source: 'cloudinary' | 'external'
  }
  status: 'draft' | 'published'
  author?: string
   coverImageCredit?: string
  createdAt: string
  updatedAt: string
}

export interface ListBlogsParams {
  page?: number
  limit?: number
  q?: string
  status?: 'all' | 'draft' | 'published'
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListBlogsResponse {
  data: Blog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters?: {
    categories: string[]
  }
}

export interface CreateBlogData {
  title: string
  excerpt: string
  content: string
  category: string
  coverImageUrl?: string
  author?: string
  status?: 'draft' | 'published'
  coverImageCredit?: string
}

/**
 * List blogs (admin)
 */
export async function listBlogs(
  params: ListBlogsParams = {}
): Promise<ApiResponse<ListBlogsResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.q) queryParams.append('q', params.q)
  if (params.status && params.status !== 'all') queryParams.append('status', params.status)
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<ListBlogsResponse>(`/admin/blogs${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get a single blog by ID (admin)
 */
export async function getBlog(id: string): Promise<ApiResponse<Blog>> {
  return get<Blog>(`/admin/blogs/${id}`)
}

/**
 * Create a new blog (admin)
 * Supports FormData for file uploads
 */
export async function createBlog(
  data: CreateBlogData | FormData
): Promise<ApiResponse<Blog>> {
  const API_BASE_URL = getApiBaseUrl()
  
  // If FormData, use fetch directly
  if (data instanceof FormData) {
    const response = await fetch(`${API_BASE_URL}/admin/blogs`, {
      method: 'POST',
      body: data,
      credentials: 'include'
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
        error: result.error || result.message
      }
    }
    
    return {
      success: true,
      data: result.data || result,
      message: result.message
    }
  }
  
  // Otherwise use JSON
  return post<Blog>('/admin/blogs', data)
}

/**
 * Update blog (admin)
 * Supports FormData for file uploads
 */
export async function updateBlog(
  id: string,
  data: Partial<CreateBlogData> | FormData
): Promise<ApiResponse<Blog>> {
  const API_BASE_URL = getApiBaseUrl()
  
  // If FormData, use fetch directly
  if (data instanceof FormData) {
    const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
      method: 'PUT',
      body: data,
      credentials: 'include'
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP error! status: ${response.status}`,
        error: result.error || result.message
      }
    }
    
    return {
      success: true,
      data: result.data || result,
      message: result.message
    }
  }
  
  // Otherwise use JSON
  return put<Blog>(`/admin/blogs/${id}`, data)
}

/**
 * Delete blog (admin)
 */
export async function deleteBlog(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/blogs/${id}`)
}

/**
 * Publish blog (admin)
 */
export async function publishBlog(id: string): Promise<ApiResponse<Blog>> {
  return patch<Blog>(`/admin/blogs/${id}/publish`, {})
}

/**
 * Unpublish blog (admin)
 */
export async function unpublishBlog(id: string): Promise<ApiResponse<Blog>> {
  return patch<Blog>(`/admin/blogs/${id}/unpublish`, {})
}

export default {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog
}
