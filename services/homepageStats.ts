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

/**
 * Merge the 'homepage-stats' ISR cache tag under caller-supplied fetch options
 * so both time-based revalidation (caller's `revalidate`) and on-demand
 * revalidateTag('homepage-stats') can refresh the same cached responses.
 */
function withHomepageStatsTag(
  options: RequestInit & { withCredentials?: boolean }
): RequestInit & { withCredentials?: boolean } {
  return { withCredentials: false, ...options, next: { tags: ['homepage-stats'], ...options.next } }
}

export async function getHomepageStats(
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<HomepageStatsData>> {
  return get<HomepageStatsData>('/homepage-stats', withHomepageStatsTag(options))
}

export default {
  getHomepageStats,
}
