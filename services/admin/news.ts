/**
 * Admin News API service
 * Handles all API calls related to news management (admin only)
 */

import { get, post, put, del, patch, ApiResponse, getApiBaseUrl } from '../api'

export interface News {
  _id: string
  title: string
  slug: string
  source: string
  excerpt: string
  content: string
  coverImage: {
    url: string
    source: 'cloudinary' | 'external'
  }
  publishedAt: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface ListNewsParams {
  page?: number
  limit?: number
  q?: string
  status?: 'all' | 'draft' | 'published'
  source?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListNewsResponse {
  data: News[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters?: {
    sources: string[]
  }
}

export interface CreateNewsData {
  title: string
  source: string
  excerpt: string
  content: string
  coverImageUrl?: string
  publishedAt?: string
  status?: 'draft' | 'published'
}

/**
 * List news (admin)
 */
export async function listNews(
  params: ListNewsParams = {}
): Promise<ApiResponse<ListNewsResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.q) queryParams.append('q', params.q)
  if (params.status && params.status !== 'all') queryParams.append('status', params.status)
  if (params.source) queryParams.append('source', params.source)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<ListNewsResponse>(`/admin/news${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get a single news by ID (admin)
 */
export async function getNews(id: string): Promise<ApiResponse<News>> {
  return get<News>(`/admin/news/${id}`)
}

/**
 * Create a new news (admin)
 * Supports FormData for file uploads
 */
export async function createNews(
  data: CreateNewsData | FormData
): Promise<ApiResponse<News>> {
  const API_BASE_URL = getApiBaseUrl()
  
  // If FormData, use fetch directly
  if (data instanceof FormData) {
    const response = await fetch(`${API_BASE_URL}/admin/news`, {
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
  return post<News>('/admin/news', data)
}

/**
 * Update news (admin)
 * Supports FormData for file uploads
 */
export async function updateNews(
  id: string,
  data: Partial<CreateNewsData> | FormData
): Promise<ApiResponse<News>> {
  const API_BASE_URL = getApiBaseUrl()
  
  // If FormData, use fetch directly
  if (data instanceof FormData) {
    const response = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
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
  return put<News>(`/admin/news/${id}`, data)
}

/**
 * Delete news (admin)
 */
export async function deleteNews(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/news/${id}`)
}

/**
 * Publish news (admin)
 */
export async function publishNews(id: string): Promise<ApiResponse<News>> {
  return patch<News>(`/admin/news/${id}/publish`, {})
}

/**
 * Unpublish news (admin)
 */
export async function unpublishNews(id: string): Promise<ApiResponse<News>> {
  return patch<News>(`/admin/news/${id}/unpublish`, {})
}

export default {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews
}
