import DOMPurify from 'isomorphic-dompurify'

const SANITIZE_OPTIONS = {
  ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ADD_ATTR: ['target', 'rel', 'colspan', 'rowspan'],
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html || '', SANITIZE_OPTIONS)
}
