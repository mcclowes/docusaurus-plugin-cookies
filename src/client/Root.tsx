import React from 'react'
import { CookieConsentProvider } from './Provider'

// Access plugin data from Docusaurus global
function getPluginOptions() {
  if (typeof window === 'undefined') return null

  try {
    const globalData = (window as any).docusaurus?.globalData
    return globalData?.['docusaurus-plugin-cookie-consent']?.default?.options ?? null
  } catch {
    return null
  }
}

function ClientOnlyModal() {
  // Only render on client side
  if (typeof window === 'undefined') return null

  const options = getPluginOptions()
  if (!options) return null

  // Dynamic import to avoid SSR
  const { CookieConsentModal } = require('./Modal')
  return <CookieConsentModal options={options} />
}

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const storageKey = typeof window !== 'undefined'
    ? (getPluginOptions()?.storageKey ?? 'cookie-consent-preferences')
    : 'cookie-consent-preferences'

  return (
    <CookieConsentProvider storageKey={storageKey}>
      {children}
      <ClientOnlyModal />
    </CookieConsentProvider>
  )
}
