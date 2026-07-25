/**
 * Admin Jobs (Careers Openings) API service
 * Handles all API calls related to managing career openings (admin only)
 */

import { get, post, put, del, patch, ApiResponse } from '../api'

export type JobStatus = 'draft' | 'published' | 'archived'

export interface Job {
  _id: string
  title: string
  fullDescription: string
  requirements: string[]
  location: string
  jobType: string
  workMode: string
  duration?: string
  applicationEmail: string
  orderingIndex: number
  published: boolean
  status: JobStatus
  translationKey?: string
  createdAt: string
  updatedAt: string
}

export interface CreateJobData {
  title: string
  fullDescription: string
  requirements: string[]
  location: string
  jobType: string
  workMode: string
  duration?: string
  applicationEmail: string
  orderingIndex?: number
  published?: boolean
  translationKey?: string
}

export type UpdateJobData = Partial<CreateJobData>

/**
 * List all jobs (careers openings) for admin
 */
export async function listJobs(): Promise<ApiResponse<Job[]>> {
  return get<Job[]>('/admin/careers')
}

/**
 * Get a single job by ID (admin)
 */
export async function getJob(id: string): Promise<ApiResponse<Job>> {
  return get<Job>(`/admin/careers/${id}`)
}

/**
 * Create a new job (admin)
 */
export async function createJob(data: CreateJobData): Promise<ApiResponse<Job>> {
  return post<Job>('/admin/careers', data)
}

/**
 * Update a job (admin)
 */
export async function updateJob(id: string, data: UpdateJobData): Promise<ApiResponse<Job>> {
  return put<Job>(`/admin/careers/${id}`, data)
}

/**
 * Publish a job (admin)
 */
export async function publishJob(id: string): Promise<ApiResponse<Job>> {
  return patch<Job>(`/admin/careers/${id}/publish`, {})
}

/**
 * Unpublish a job (admin)
 */
export async function unpublishJob(id: string): Promise<ApiResponse<Job>> {
  return patch<Job>(`/admin/careers/${id}/unpublish`, {})
}

/**
 * Archive a job (soft delete) (admin)
 */
export async function archiveJob(id: string): Promise<ApiResponse<Job>> {
  return patch<Job>(`/admin/careers/${id}/archive`, {})
}

/**
 * Permanently delete a job (admin)
 */
export async function deleteJob(id: string): Promise<ApiResponse<void>> {
  return del<void>(`/admin/careers/${id}`)
}

export default {
  listJobs,
  getJob,
  createJob,
  updateJob,
  publishJob,
  unpublishJob,
  archiveJob,
  deleteJob,
}

