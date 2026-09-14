/**
 * Public Jobs (Careers) API service
 * Handles all API calls related to published career openings (public)
 */

import { get, ApiResponse } from './api'

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

/**
 * Merge the 'careers' ISR cache tag under caller-supplied fetch options so both
 * time-based revalidation (caller's `revalidate`) and on-demand
 * revalidateTag('careers') can refresh the same cached responses.
 */
function withCareersTag(
  options: RequestInit & { withCredentials?: boolean }
): RequestInit & { withCredentials?: boolean } {
  return { withCredentials: false, ...options, next: { tags: ['careers'], ...options.next } }
}

/**
 * Get all published jobs (careers) in display order
 */
export async function getJobs(
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<Job[]>> {
  return get<Job[]>('/careers', withCareersTag(options))
}

export default {
  getJobs,
}

