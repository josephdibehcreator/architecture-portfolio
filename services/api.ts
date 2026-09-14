/**
 * Main API configuration and base functions for connecting to the backend
 *
 * The backend API base URL MUST be provided via NEXT_PUBLIC_API_URL — there is
 * no fallback. A missing value throws at module scope so the build (and dev
 * server) fails immediately instead of silently talking to the wrong backend.
 *
 * - Local development: http://localhost:5000/api (.env.local)
 * - Production (Vercel): https://architect-portfolio-backend-5bow.onrender.com/api
 *   (set in Vercel project settings — the build fails without it)
 */

export function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '')

  if (!apiUrl) {
    throw new Error(
      'FATAL: NEXT_PUBLIC_API_URL is not set. ' +
        'It is required for every backend API call. ' +
        'Add it to .env.local (http://localhost:5000/api) and to the Vercel project settings, then rebuild.'
    )
  }

  return apiUrl
}

const API_BASE_URL = getApiBaseUrl()

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status?: number
}

/**
 * 1-hour cache (3600 s) for public-facing GET requests.
 *
 * Two complementary layers:
 *  1. Next.js ISR — `next: { revalidate }` on the fetch call (server only;
 *     silently ignored by fetch in the browser).
 *  2. In-memory Map — client-side fallback with the same TTL so repeated
 *     public GETs within a session skip the network entirely.
 *
 * Both layers are skipped for admin routes, state-mutating methods, and the
 * inquiry / Stripe / billing flows that must stay strictly real-time.
 */
const REVALIDATE_SECONDS = 3600
const CLIENT_CACHE_TTL = 3600 * 1000

const clientGetCache = new Map<string, { data: ApiResponse<unknown>; expiresAt: number }>()

const CACHE_EXCLUDED_PREFIXES = ['/admin/', '/inquiries/', '/stripe/', '/billing/']

function isCacheableGet(endpoint: string, method?: string): boolean {
  if (method !== 'GET') return false
  return !CACHE_EXCLUDED_PREFIXES.some(prefix => endpoint.startsWith(prefix))
}

/**
 * Base fetch function with error handling
 *
 * The `withCredentials` flag allows public callers to opt-out of sending
 * cookies (useful for cross-site, public GETs), while admin/auth calls
 * keep using credentials by default.
 */
async function fetchApi<T>(
  endpoint: string,
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    const { withCredentials, headers, ...rest } = options

    const cacheable = isCacheableGet(endpoint, rest.method)

    // Client-side in-memory cache (browser only; Map resets on full reload
    // but persists across client-side navigations).
    if (cacheable && typeof window !== 'undefined') {
      const cached = clientGetCache.get(endpoint)
      if (cached) {
        if (cached.expiresAt > Date.now()) {
          return cached.data as ApiResponse<T>
        }
        clientGetCache.delete(endpoint)
      }
    }

    const fetchOptions: RequestInit = {
      ...rest,
      credentials: withCredentials === false ? 'omit' : 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    // Inject ISR revalidation for cacheable public GETs. The `next` option
    // is a no-op in the browser; it only takes effect in Server Components.
    // Caller-supplied `cache` / `next` take precedence and are not overridden.
    if (cacheable && !fetchOptions.cache && !fetchOptions.next) {
      fetchOptions.next = { revalidate: REVALIDATE_SECONDS }
    }

    const response = await fetch(url, fetchOptions)

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`,
        error: data.error || data.message,
      }
    }

    const result: ApiResponse<T> = {
      success: true,
      data: data.data || data,
      message: data.message,
    }

    // Only successful responses are cached client-side; errors are never cached.
    if (cacheable && typeof window !== 'undefined') {
      clientGetCache.set(endpoint, {
        data: result,
        expiresAt: Date.now() + CLIENT_CACHE_TTL,
      })
    }

    return result
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * GET request
 *
 * Accepts optional RequestInit so callers (e.g. Server Components) can
 * control caching (`cache: 'no-store'`, `next` options, etc.).
 */
export async function get<T>(
  endpoint: string,
  options: (RequestInit & { withCredentials?: boolean }) = {}
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'GET',
    ...options,
  })
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 */
export async function put<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * PATCH request
 */
export async function patch<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    method: 'DELETE',
  })
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
}

