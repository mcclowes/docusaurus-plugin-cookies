import React from 'react'
import OriginalRoot from '@theme-original/Root'
import { CookieConsentProvider } from '../client/Provider'

export default function Root(props: React.ComponentProps<typeof OriginalRoot>) {
  // Wrap with Provider so components can use useCookieConsent hook
  // The modal is injected via client module to avoid SSR issues
  return (
    <CookieConsentProvider storageKey="cookie-consent-preferences">
      <OriginalRoot {...props} />
    </CookieConsentProvider>
  )
}
