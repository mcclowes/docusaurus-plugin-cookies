// This file is bundled into the client. Keep it light.
export function onRouteDidUpdate() {
  // Simple no-op to prove client module wiring works.
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[docusaurus-plugin-starter] route updated')
  }
}

