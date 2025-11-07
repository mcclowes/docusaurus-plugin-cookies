import React from 'react'
import OriginalRoot from '@theme-original/Root'
import CookieConsentRoot from '../client/Root'

export default function Root(props: React.ComponentProps<typeof OriginalRoot>) {
  return (
    <CookieConsentRoot>
      <OriginalRoot {...props} />
    </CookieConsentRoot>
  )
}
