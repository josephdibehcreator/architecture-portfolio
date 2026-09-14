/**
 * Public Projects API service
 * Handles all API calls related to projects (public)
 */

import { get, ApiResponse } from './api'

export interface ProjectInfo {
  maitreDouverage: string
  maitreDoeuvre: string
  ingenieurs: string
  surface: string
  programme: string
  budget: string
  statut: string
  fullDescription: string
}

export interface Project {
  _id: string
  title: string
  slug: string
  tag: 'Residential' | 'Commercial'
  year: string | null
  category: string | null
  description: string
  coverImage: string | null
  images: string[]
  plans: string[]
  info: ProjectInfo
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface GetProjectsParams {
  tag?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface GetProjectsResponse {
  data: Project[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

/**
 * Merge the 'projects' ISR cache tag under caller-supplied fetch options so
 * both time-based revalidation (caller's `revalidate`) and on-demand
 * revalidateTag('projects') can refresh the same cached responses.
 */
function withProjectsTag(
  options: RequestInit & { withCredentials?: boolean }
): RequestInit & { withCredentials?: boolean } {
  return { ...options, next: { tags: ['projects'], ...options.next } }
}

/**
 * Get all published projects (public)
 */
export async function getProjects(
  params: GetProjectsParams = {},
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<Project[]>> {
  const queryParams = new URLSearchParams()

  if (params.tag) queryParams.append('tag', params.tag)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<Project[]>(`/projects${queryString ? `?${queryString}` : ''}`, withProjectsTag(options))
}

/**
 * Get published projects with pagination (public).
 *
 * Passing page/limit switches the backend to its paginated response shape
 * ({ data, pagination }); the flat-array getProjects() above is left untouched
 * for the home page, sitemap, and generateStaticParams.
 */
export async function getProjectsPaginated(
  params: GetProjectsParams & { page?: number; limit?: number } = {},
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<GetProjectsResponse>> {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.tag) queryParams.append('tag', params.tag)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<GetProjectsResponse>(`/projects${queryString ? `?${queryString}` : ''}`, withProjectsTag(options))
}

/**
 * Get a single project by slug (public)
 *
 * Accepts optional RequestInit so server-side callers can control caching,
 * while client-side calls default to standard browser behavior.
 */
export async function getProjectBySlug(
  slug: string,
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<Project>> {
  return get<Project>(`/projects/${slug}`, withProjectsTag(options))
}

/**
 * Get a single project by id (public)
 * Uses the same base /projects endpoint as other project APIs.
 */
export async function getProjectById(id: string): Promise<ApiResponse<Project>> {
  return get<Project>(`/projects/${id}`, withProjectsTag({}))
}

export default {
  getProjects,
  getProjectsPaginated,
  getProjectBySlug,
  getProjectById,
}
