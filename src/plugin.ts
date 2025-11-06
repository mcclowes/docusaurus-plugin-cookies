import type { LoadContext, Plugin } from '@docusaurus/types'
import type { PluginStarterOptions } from './types'

export default function pluginStarter(
  context: LoadContext,
  options: PluginStarterOptions
): Plugin<void> {
  const { siteDir } = context
  const resolvedOptions: Required<PluginStarterOptions> = {
    enabled: options.enabled ?? true,
    greetingMessage: options.greetingMessage ?? 'Hello from plugin-starter!'
  }

  return {
    name: 'docusaurus-plugin-starter',

    // Called during site build/serve. Use to produce data to be consumed later.
    async loadContent() {
      if (!resolvedOptions.enabled) return undefined
      return {
        greeting: resolvedOptions.greetingMessage,
        siteDir,
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

