import { get, put, ApiResponse } from '../api'
import type {
  HomepageStatItem,
} from '../homepageStats'

export interface AdminHomepageStatsData {
  key: string
  items: HomepageStatItem[]
  updatedAt?: string | null
  updatedBy?: {
    id: string
    email: string
  } | null
}

export interface UpdateHomepageStatsPayload {
  items: HomepageStatItem[]
}

export async function getAdminHomepageStats(): Promise<ApiResponse<AdminHomepageStatsData>> {
  return get<AdminHomepageStatsData>('/admin/homepage-stats')
}

export async function updateHomepageStats(
  payload: UpdateHomepageStatsPayload
): Promise<ApiResponse<AdminHomepageStatsData>> {
  return put<AdminHomepageStatsData>('/admin/homepage-stats', payload)
}

export default {
  getAdminHomepageStats,
  updateHomepageStats,
}
