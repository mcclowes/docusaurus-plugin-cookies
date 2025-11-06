/**
 * Example: Conditional Loading with Options
 *
 * This pattern shows how to use plugin options passed from the server
 * to conditionally enable/disable features or configure behavior.
 *
 * Note: Options must be serializable and passed via global data or
 * embedded in the client bundle.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// In a real plugin, you'd get these from globalData or inline them during build
declare global {
  interface Window {
    DOCUSAURUS_PLUGIN_OPTIONS?: {
      enabled?: boolean;
      selector?: string;
      theme?: 'light' | 'dark' | 'auto';
    };
  }
}

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  // Get options from global data (would be set by plugin during build)
  const options = window.DOCUSAURUS_PLUGIN_OPTIONS || {
    enabled: true,
    selector: '.markdown img',
    theme: 'auto',
  };

  // Early return if plugin is disabled
  if (!options.enabled) {
    return null;
  }

  return {
    onRouteUpdate({ location }) {
      console.log('Plugin running with options:', options);

      // Use the configured selector
      const elements = document.querySelectorAll(options.selector);

      // Apply theme-aware styling
      const theme = options.theme === 'auto'
        ? (document.documentElement.getAttribute('data-theme') || 'light')
        : options.theme;

      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.setAttribute('data-plugin-theme', theme);
          // Apply theme-specific enhancements
        }
      });
    },
  };
})();
