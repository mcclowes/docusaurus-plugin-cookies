import type { LoadContext, Plugin } from '@docusaurus/types'
import type { CookieConsentOptions } from './types'

export default function cookieConsentPlugin(
  context: LoadContext,
  options: CookieConsentOptions = {}
): Plugin<void> {
  const resolvedOptions: Required<Omit<CookieConsentOptions, 'categories'>> & { categories?: CookieConsentOptions['categories'] } = {
    enabled: options.enabled ?? true,
    title: options.title ?? 'Cookie Consent',
    description: options.description ?? 'We use cookies to enhance your browsing experience and analyze our traffic.',
    links: options.links ?? [],
    acceptAllText: options.acceptAllText ?? 'Accept All',
    rejectOptionalText: options.rejectOptionalText ?? 'Reject Optional',
    rejectAllText: options.rejectAllText ?? 'Reject All',
    storageKey: options.storageKey ?? 'cookie-consent-preferences',
    toastMode: options.toastMode ?? false,
    categories: options.categories,
  }

  return {
    name: 'docusaurus-plugin-cookies',

    // Called during site build/serve. Use to produce data to be consumed later.
    async loadContent() {
      if (!resolvedOptions.enabled) return undefined
      return {
        options: resolvedOptions,
      }
    },

    // Called after loadContent. Use to create routes or inject data into the client.
    async contentLoaded({ content, actions }) {
      if (!content) return
      const { setGlobalData } = actions
      setGlobalData(content)
    },

    // Optionally ship client modules. These run on the client bundle.
    getClientModules() {
      if (!resolvedOptions.enabled) return []
      return [require.resolve('./client')]
    },
  }
}

