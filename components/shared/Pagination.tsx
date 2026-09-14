import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Route the links point at, e.g. "/projects" or "/news". */
  basePath: string
  /** Query-string key this control drives (e.g. "page", "blogPage"). */
  pageParam?: string
  /** Current searchParams, so other query keys are preserved across pages. */
  searchParams?: Record<string, string | string[] | undefined>
  /** Optional element id to scroll to on navigation (e.g. "projects-scroll"). */
  scrollTargetId?: string
}

/**
 * Numbered, URL-based pagination (soft-navigated via next/link).
 *
 * Renders real, crawlable ?page=N links so search engines can discover older
 * content. Hidden entirely when there is only a single page.
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  pageParam = 'page',
  searchParams = {},
  scrollTargetId,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    // Preserve every other query key (e.g. the sibling list's page on /news)
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== pageParam && typeof value === 'string') {
        params.set(key, value)
      }
    }
    // Keep page 1 clean (no ?page=1)
    if (page > 1) params.set(pageParam, String(page))
    const queryString = params.toString()
    const hash = scrollTargetId ? `#${scrollTargetId}` : ''
    return `${basePath}${queryString ? `?${queryString}` : ''}${hash}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <nav aria-label="Pagination" className="d-flex justify-content-center my-5">
      <ul className="pagination mb-0">
        <li className={`page-item ${isFirst ? 'disabled' : ''}`}>
          {isFirst ? (
            <span className="page-link" aria-hidden="true">‹</span>
          ) : (
            <Link className="page-link" href={buildHref(currentPage - 1)} aria-label="Previous page">
              ‹
            </Link>
          )}
        </li>

        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            {page === currentPage ? (
              <span className="page-link" aria-current="page">
                {page}
              </span>
            ) : (
              <Link className="page-link" href={buildHref(page)}>
                {page}
              </Link>
            )}
          </li>
        ))}

        <li className={`page-item ${isLast ? 'disabled' : ''}`}>
          {isLast ? (
            <span className="page-link" aria-hidden="true">›</span>
          ) : (
            <Link className="page-link" href={buildHref(currentPage + 1)} aria-label="Next page">
              ›
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}
