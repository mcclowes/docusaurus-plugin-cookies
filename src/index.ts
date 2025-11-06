import cookieConsentPlugin from './plugin'
export default cookieConsentPlugin

export type { CookieConsentOptions, CookieCategory, CookieConsentLink } from './types'

// Export hooks for use in user components
export { useCookieConsent } from './client/CookieContext'
export type { CookiePreferences } from './client/CookieContext'

