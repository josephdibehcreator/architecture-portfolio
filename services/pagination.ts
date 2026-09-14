import type { ApiResponse } from './api'

export interface PaginatedList<T> {
  data: T[]
  pagination?: { page?: number; limit?: number; total?: number; totalPages?: number }
}

export interface ClampedPage<T> {
  items: T[]
  page: number
  totalPages: number
}

/**
 * Parses a ?page=N query value, tolerating arrays (?page=1&page=2) and junk.
 */
export function parsePageParam(value: string | string[] | undefined, fallback = 1): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(raw ?? '', 10)
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback
}

/**
 * Fetches one page of a paginated collection. When a stale ?page=N link points
 * beyond the final page (e.g. after items were deleted), the last valid page is
 * re-fetched so users never land on an empty grid.
 */
export async function fetchPageWithClamp<T>(
  fetchPage: (page: number) => Promise<ApiResponse<PaginatedList<T>>>,
  requestedPage: number
): Promise<ClampedPage<T>> {
  const first = await fetchPage(requestedPage)
  const totalPages = first.data?.pagination?.totalPages ?? 1
  const items = first.data?.data ?? []

  if (items.length === 0 && requestedPage > totalPages && totalPages >= 1) {
    const clamped = await fetchPage(totalPages)
    return {
      items: clamped.data?.data ?? [],
      page: totalPages,
      totalPages,
    }
  }

  return { items, page: requestedPage, totalPages }
}
