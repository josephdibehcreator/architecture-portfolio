/**
 * Testimonials API service
 * Handles all API calls related to testimonials
 */

import { get, post, put, patch, del, ApiResponse } from './api'

export interface Testimonial {
  _id?: string
  fullName: string
  phoneNumber?: string | null
  email: string
  projectType?: string | null
  review: string
  status?: 'pending' | 'approved' | 'rejected'
  approvedAt?: string
  approvedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateTestimonialData {
  fullName: string
  phoneNumber?: string
  email: string
  projectType?: string
  review: string
}

export interface UpdateTestimonialData {
  fullName?: string
  phoneNumber?: string | null
  email?: string
  projectType?: string | null
  review?: string
}

export interface AdminTestimonialsResponse {
  data: Testimonial[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Merge the 'testimonials' ISR cache tag under caller-supplied fetch options so
 * both time-based revalidation (caller's `revalidate`) and on-demand
 * revalidateTag('testimonials') can refresh the same cached responses.
 */
function withTestimonialsTag(
  options: RequestInit & { withCredentials?: boolean }
): RequestInit & { withCredentials?: boolean } {
  return { ...options, next: { tags: ['testimonials'], ...options.next } }
}

/**
 * Get all testimonials
 */
export async function getTestimonials(
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<Testimonial[]>> {
  return get<Testimonial[]>('/testimonials', withTestimonialsTag(options))
}

/**
 * Get a single testimonial by ID
 */
export async function getTestimonialById(id: string): Promise<ApiResponse<Testimonial>> {
  return get<Testimonial>(`/testimonials/${id}`, withTestimonialsTag({}))
}

/**
 * Create a new testimonial
 */
export async function createTestimonial(
  data: CreateTestimonialData
): Promise<ApiResponse<Testimonial>> {
  return post<Testimonial>('/testimonials', data)
}

/**
 * Update a testimonial
 */
export async function updateTestimonial(
  id: string,
  data: UpdateTestimonialData
): Promise<ApiResponse<Testimonial>> {
  return put<Testimonial>(`/testimonials/${id}`, data)
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/testimonials/${id}`)
}

// ========== ADMIN ENDPOINTS ==========

/**
 * Get all testimonials for admin (with filtering)
 */
export async function getAdminTestimonials(params?: {
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  page?: number
  limit?: number
}): Promise<ApiResponse<AdminTestimonialsResponse>> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.page) queryParams.append('page', String(params.page))
  if (params?.limit) queryParams.append('limit', String(params.limit))
  
  const query = queryParams.toString()
  return get<AdminTestimonialsResponse>(`/admin/testimonials${query ? `?${query}` : ''}`)
}

/**
 * Approve a testimonial
 */
export async function approveTestimonial(id: string): Promise<ApiResponse<Testimonial>> {
  return patch<Testimonial>(`/admin/testimonials/${id}/approve`)
}

/**
 * Reject a testimonial
 */
export async function rejectTestimonial(id: string): Promise<ApiResponse<Testimonial>> {
  return patch<Testimonial>(`/admin/testimonials/${id}/reject`)
}

/**
 * Delete a testimonial (admin)
 */
export async function deleteAdminTestimonial(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/testimonials/${id}`)
}

export default {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteAdminTestimonial,
}

