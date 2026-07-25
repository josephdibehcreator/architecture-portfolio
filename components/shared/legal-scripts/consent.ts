export const COOKIE_NOTICE_ACK_NAME = 'cookie_notice_ack'
export const COOKIE_ANALYTICS_CONSENT_NAME = 'cookie_analytics_consent'

const DEFAULT_MAX_AGE_DAYS = 365
export const ANALYTICS_CONSENT_EVENT = 'analytics-consent-changed'

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))

  return value ? value.split('=')[1] ?? null : null
}

export function setCookie(name: string, value: string, days: number = DEFAULT_MAX_AGE_DAYS): void {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setDate(expires.getDate() + days)

  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
}

export function hasAnalyticsConsent(): boolean {
  const value = getCookie(COOKIE_ANALYTICS_CONSENT_NAME)
  return value !== null && value.toLowerCase() === 'true'
}

export function dispatchConsentChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
}

