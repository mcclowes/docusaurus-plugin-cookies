// Export Root wrapper component for Docusaurus
export { default } from './Root'

// Re-export public hooks/types for convenience
export * from './hooks'
export { CookieConsentProvider, useCookieConsent } from './Provider'
export type { CookiePreferences } from './Provider'
export { CookieConsentModal } from './Modal'

// Legacy exports for backward compatibility
export { CookieConsentProvider as CookieProvider } from './Provider'
