// Client module that runs only on the client side
// This injects the cookie consent modal after the page loads

import React from 'react'
import { createRoot } from 'react-dom/client'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { CookieConsentProvider } from './Provider'
import { CookieConsentModal } from './Modal'
import './Modal.css'

if (ExecutionEnvironment.canUseDOM) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent)
  } else {
    initCookieConsent()
  }
}

function initCookieConsent() {
  // Access plugin data from Docusaurus global
  const globalData = (window as any)?.docusaurus?.globalData
  const options = globalData?.['docusaurus-plugin-cookie-consent']?.default?.options

  if (!options) return

  // Create a container for the cookie consent modal
  const container = document.createElement('div')
  container.id = 'docusaurus-cookie-consent-root'
  document.body.appendChild(container)

  const storageKey = options?.storageKey ?? 'cookie-consent-preferences'

  // Render the cookie consent system
  const root = createRoot(container)
  root.render(
    <CookieConsentProvider storageKey={storageKey}>
      <CookieConsentModal options={options} />
    </CookieConsentProvider>
  )
}
