import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { CookieConsentProvider } from './Provider'

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <CookieConsentProvider storageKey="cookie-consent-preferences">
      {children}
      <BrowserOnly fallback={<></>}>
        {() => {
          // Only import and render modal on client side
          const { CookieConsentModal } = require('./Modal')

          // Access plugin data from Docusaurus global
          const globalData = (window as any)?.docusaurus?.globalData
          const options = globalData?.['docusaurus-plugin-cookie-consent']?.default?.options

          if (!options) return <></>

          return <CookieConsentModal options={options} />
        }}
      </BrowserOnly>
    </CookieConsentProvider>
  )
}
