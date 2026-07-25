/**
 * Admin Career API service
 * Handles all API calls related to career application management (admin only)
 */

import { get, patch, ApiResponse, getApiBaseUrl } from '../api'

export interface CareerApplication {
  _id: string
  fullName: string
  email: string
  phone?: string
  motivationLetter: string
  jobTitle: string
  cvUrl: string
  portfolioUrl?: string | null
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  adminNote?: string | null
  reviewedAt?: string
  reviewedBy?: {
    id: string
    email: string
  }
  createdAt: string
  updatedAt: string
  applicantEmailSent?: boolean
  applicantEmailSentAt?: string
  hrNotificationSent?: boolean
  hrNotificationSentAt?: string
  emailErrors?: {
    type?: string
    message: string
    skippedCode?: string
    at?: string
  }[]
}

export interface ListApplicationsParams {
  page?: number
  limit?: number
  q?: string
  status?: string
  jobTitle?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ListApplicationsResponse {
  data: CareerApplication[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filters: {
    jobTitles: string[]
  }
}

export interface UpdateApplicationStatusData {
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  adminNote?: string
}

export interface BulkUpdateStatusData {
  ids: string[]
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
}

/**
 * List career applications (admin)
 */
export async function listApplications(
  params: ListApplicationsParams = {}
): Promise<ApiResponse<ListApplicationsResponse>> {
  const queryParams = new URLSearchParams()
  
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.q) queryParams.append('q', params.q)
  if (params.status) queryParams.append('status', params.status)
  if (params.jobTitle) queryParams.append('jobTitle', params.jobTitle)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.order) queryParams.append('order', params.order)

  const queryString = queryParams.toString()
  return get<ListApplicationsResponse>(`/admin/career${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get a single application by ID (admin)
 */
export async function getApplication(id: string): Promise<ApiResponse<CareerApplication>> {
  return get<CareerApplication>(`/admin/career/${id}`)
}

/**
 * Update application status (admin)
 */
export async function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusData
): Promise<ApiResponse<CareerApplication>> {
  return patch<CareerApplication>(`/admin/career/${id}/status`, data)
}

/**
 * Bulk update application status (admin)
 */
export async function bulkUpdateStatus(
  data: BulkUpdateStatusData
): Promise<ApiResponse<{ updated: number; total: number }>> {
  return patch<{ updated: number; total: number }>('/admin/career/bulk-status', data)
}

/**
 * Export applications to CSV (admin)
 */
export async function exportApplications(
  params: { ids?: string[]; status?: string } = {}
): Promise<Blob> {
  const queryParams = new URLSearchParams()
  
  if (params.ids && params.ids.length > 0) {
    queryParams.append('ids', params.ids.join(','))
  }
  if (params.status) {
    queryParams.append('status', params.status)
  }

  const queryString = queryParams.toString()
  const url = `/admin/career/export${queryString ? `?${queryString}` : ''}`
  
  // Use centralized API base URL from api.ts
  const API_BASE_URL = getApiBaseUrl()

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to export applications')
  }

  return response.blob()
}

/**
 * Get download URL for CV or Portfolio (admin)
 */
export function getDownloadUrl(id: string, type: 'cv' | 'portfolio'): string {
  // Use centralized API base URL from api.ts
  const API_BASE_URL = getApiBaseUrl()
  
  return `${API_BASE_URL}/admin/career/${id}/download?type=${type}`
}

export default {
  listApplications,
  getApplication,
  updateApplicationStatus,
  bulkUpdateStatus,
  exportApplications,
  getDownloadUrl
}
