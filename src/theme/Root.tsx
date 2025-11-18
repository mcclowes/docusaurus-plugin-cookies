import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import useGlobalData from '@docusaurus/useGlobalData'
import { CookieConsentProvider } from '../client/Provider'
import { CookieConsentModal } from '../client/Modal'
import type { CookieConsentOptions } from '../types'
import '../client/Modal.css'

export default function Root({ children }: { children: React.ReactNode }) {
  const globalData = useGlobalData()
  const pluginData = globalData?.['docusaurus-plugin-cookie-consent']?.default as
    | {
        options: CookieConsentOptions
      }
    | undefined

  return (
    <CookieConsentProvider storageKey="cookie-consent-preferences">
      {children}
      {pluginData?.options && (
        <BrowserOnly>{() => <CookieConsentModal options={pluginData.options} />}</BrowserOnly>
      )}
    </CookieConsentProvider>
  )
}
