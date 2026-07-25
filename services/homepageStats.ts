import { get, ApiResponse } from './api'

export type HomepageStatSuffix = '' | '+' | '%'

export interface HomepageStatItem {
  label: string
  value: number
  suffix: HomepageStatSuffix
}

export interface HomepageStatsData {
  items: HomepageStatItem[]
}

export async function getHomepageStats(
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<HomepageStatsData>> {
  return get<HomepageStatsData>('/homepage-stats', { withCredentials: false, ...options })
}

export default {
  getHomepageStats,
}
