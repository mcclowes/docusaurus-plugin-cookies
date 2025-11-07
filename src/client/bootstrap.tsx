import React from 'react'
import ReactDOM from 'react-dom/client'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { CookieProvider } from './CookieContext'
import { CookieConsentModal } from './CookieConsentModal'
import type { CookieConsentOptions } from '../types'

// Access global data from Docusaurus
function getPluginOptions(): CookieConsentOptions | null {
  if (typeof window === 'undefined') return null

  // Access global data - try multiple possible locations
  const docusaurus = (window as any).docusaurus || (window as any).__docusaurus
  const globalData = docusaurus?.globalData

  const pluginData =
    globalData?.['docusaurus-plugin-cookies']?.default ??
    docusaurus?.pluginData?.['docusaurus-plugin-cookies']?.default ??
    docusaurus?.plugin?.data?.['docusaurus-plugin-cookies']?.default

  return pluginData?.options ?? null
}

function CookieConsentApp() {
  const [options, setOptions] = React.useState<CookieConsentOptions | null>(null)

  React.useEffect(() => {
    // Try to get options immediately
    const opts = getPluginOptions()
    if (opts) {
      setOptions(opts)
      return
    }

    // If not available yet, wait a bit and try again
    const timeout = setTimeout(() => {
      const opts = getPluginOptions()
      if (opts) {
        setOptions(opts)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  if (!options) {
    return null
  }

  return (
    <CookieProvider storageKey={options.storageKey || 'cookie-consent-preferences'}>
      <CookieConsentModal options={options} />
    </CookieProvider>
  )
}

// Initialize the cookie consent component
let initialized = false
let root: ReactDOM.Root | null = null

function initializeCookieConsent() {
  if (initialized || !ExecutionEnvironment.canUseDOM) return
  initialized = true

  // Wait for Docusaurus to set up global data
  const tryInitialize = () => {
    const options = getPluginOptions()
    if (!options) {
      // Try again after a short delay
      setTimeout(tryInitialize, 100)
      return
    }

    // Create a container for the cookie consent
    let container = document.getElementById('cookie-consent-root')
    if (!container) {
      container = document.createElement('div')
      container.id = 'cookie-consent-root'
      document.body.appendChild(container)
    }

    // Render the React component
    try {
      if (!root) {
        root = ReactDOM.createRoot(container)
      }
      root.render(
        <React.StrictMode>
          <CookieConsentApp />
        </React.StrictMode>
      )
    } catch (error) {
      console.error('[docusaurus-plugin-cookies] Failed to render cookie consent:', error)
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInitialize)
  } else {
    tryInitialize()
  }
}

// Initialize when module loads
if (ExecutionEnvironment.canUseDOM) {
  initializeCookieConsent()
}

// Export lifecycle hooks for Docusaurus
export default {
  onRouteDidUpdate() {
    // Re-check if consent is needed on route changes
    // The component will handle visibility based on preferences
  },
}
