/**
 * Example: Global Event Listeners
 *
 * This pattern is for plugins that need to add global event listeners
 * that persist across route changes.
 *
 * Real-world examples:
 * - Keyboard shortcuts
 * - Analytics tracking
 * - Scroll position restoration
 * - Theme persistence
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Track if listeners have been attached (only attach once)
let listenersAttached = false;

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    /**
     * Attach global listeners only once on initial load
     */
    onRouteUpdate({ location }) {
      if (!listenersAttached) {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (event) => {
          // Example: Press '/' to focus search
          if (event.key === '/' && !isInputFocused()) {
            event.preventDefault();
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
            searchInput?.focus();
          }
        });

        // Add scroll position tracking
        let scrollTimer: NodeJS.Timeout;
        window.addEventListener('scroll', () => {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            const scrollPosition = window.scrollY;
            sessionStorage.setItem(
              `scroll-${location.pathname}`,
              scrollPosition.toString()
            );
          }, 100);
        });

        listenersAttached = true;
      }

      // Restore scroll position for this route
      const savedScroll = sessionStorage.getItem(`scroll-${location.pathname}`);
      if (savedScroll) {
        // Delay to ensure content is rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 50);
      }
    },
  };
})();

function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  return (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    (activeElement instanceof HTMLElement && activeElement.isContentEditable)
  );
}
