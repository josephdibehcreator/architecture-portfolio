/**
 * Public News API service
 * Handles all API calls related to news (public access)
 */

import { get, ApiResponse } from './api'

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
  createdAt: string
  updatedAt: string
}

export interface GetNewsParams {
  page?: number
  limit?: number
  source?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface GetNewsResponse {
  data: News[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Merge the 'news' ISR cache tag under caller-supplied fetch options so both
 * time-based revalidation (caller's `revalidate`) and on-demand
 * revalidateTag('news') can refresh the same cached responses.
 */
function withNewsTag(
  options: RequestInit & { withCredentials?: boolean }
): RequestInit & { withCredentials?: boolean } {
  return { ...options, next: { tags: ['news'], ...options.next } }
}

/**
 * Get all published news (public)
 */
export async function getNews(
  params: GetNewsParams = {},
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<GetNewsResponse>> {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.source) queryParams.append('source', params.source)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<GetNewsResponse>(`/news${queryString ? `?${queryString}` : ''}`, withNewsTag(options))
}

/**
 * Get news by slug (public)
 */
export async function getNewsBySlug(
  slug: string,
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<News>> {
  return get<News>(`/news/${slug}`, withNewsTag(options))
}

export default {
  getNews,
  getNewsBySlug
}
