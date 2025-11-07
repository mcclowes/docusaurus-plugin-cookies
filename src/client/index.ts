// Client modules should not export a default component
// as that can cause SSR issues with Docusaurus

// Re-export public hooks/types for convenience
export * from './hooks'
export { CookieConsentProvider, useCookieConsent } from './Provider'
export type { CookiePreferences } from './Provider'
export { CookieConsentModal } from './Modal'

// Legacy exports for backward compatibility
export { CookieConsentProvider as CookieProvider } from './Provider'
