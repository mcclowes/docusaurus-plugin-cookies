import React from 'react'
import { CookieProvider } from './CookieContext'
import { CookieConsentModal } from './CookieConsentModal'
import type { CookieConsentOptions } from '../types'

// Access plugin data via global variable set by Docusaurus
function usePluginData(): CookieConsentOptions | null {
  if (typeof window === 'undefined') return null

  try {
    const globalData = (window as any).docusaurus?.globalData
    const pluginData = globalData?.['docusaurus-plugin-cookie-consent']?.default
    return pluginData?.options ?? null
  } catch {
    return null
  }
}

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const options = usePluginData()
  const storageKey = options?.storageKey ?? 'cookie-consent-preferences'

  return (
    <CookieProvider storageKey={storageKey}>
      {options && <CookieConsentModal options={options} />}
      {children}
    </CookieProvider>
  )
}
