/**
 * Public Blogs API service
 * Handles all API calls related to blogs (public access)
 */

import { get, ApiResponse } from './api'

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
  author?: string
  coverImageCredit?: string
  createdAt: string
  updatedAt: string
}

export interface GetBlogsParams {
  page?: number
  limit?: number
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface GetBlogsResponse {
  data: Blog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Get all published blogs (public)
 */
export async function getBlogs(
  params: GetBlogsParams = {},
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<GetBlogsResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<GetBlogsResponse>(`/blogs${queryString ? `?${queryString}` : ''}`, options)
}

/**
 * Get blog by slug (public)
 */
export async function getBlogBySlug(
  slug: string,
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<Blog>> {
  return get<Blog>(`/blogs/${slug}`, options)
}

export default {
  getBlogs,
  getBlogBySlug
}
