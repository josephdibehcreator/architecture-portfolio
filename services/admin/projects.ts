/**
 * Admin Projects API service
 * Handles all API calls related to project management (admin only)
 */

import { get, post, put, del, patch, ApiResponse, getApiBaseUrl } from '../api'

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

export interface ListProjectsParams {
  page?: number
  limit?: number
  q?: string
  status?: string
  tag?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListProjectsResponse {
  data: Project[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filters: {
    tags: string[]
  }
}

export interface CreateProjectData {
  title: string
  slug?: string
  tag: 'Residential' | 'Commercial'
  year?: string | null
  category?: string | null
  description?: string
  coverImage?: string | null
  images?: string[]
  plans?: string[]
  info?: Partial<ProjectInfo>
  status?: 'draft' | 'published'
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  _id: string
}

/**
 * List projects (admin)
 */
export async function listProjects(
  params: ListProjectsParams = {}
): Promise<ApiResponse<ListProjectsResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.q) queryParams.append('q', params.q)
  if (params.status) queryParams.append('status', params.status)
  if (params.tag) queryParams.append('tag', params.tag)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<ListProjectsResponse>(`/admin/projects${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get a single project by ID (admin)
 */
export async function getProject(id: string): Promise<ApiResponse<Project>> {
  return get<Project>(`/admin/projects/${id}`)
}

/**
 * Create a new project (admin)
 */
export async function createProject(
  data: CreateProjectData
): Promise<ApiResponse<Project>> {
  return post<Project>('/admin/projects', data)
}

/**
 * Update project (admin)
 */
export async function updateProject(
  id: string,
  data: Partial<CreateProjectData>
): Promise<ApiResponse<Project>> {
  return put<Project>(`/admin/projects/${id}`, data)
}

/**
 * Delete project (admin)
 */
export async function deleteProject(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/projects/${id}`)
}

/**
 * Publish project (admin)
 */
export async function publishProject(id: string): Promise<ApiResponse<Project>> {
  return patch<Project>(`/admin/projects/${id}/publish`, {})
}

/**
 * Unpublish project (admin)
 */
export async function unpublishProject(id: string): Promise<ApiResponse<Project>> {
  return patch<Project>(`/admin/projects/${id}/unpublish`, {})
}

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  unpublishProject
}
