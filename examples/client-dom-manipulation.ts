/**
 * Example: DOM Manipulation Client Module
 *
 * This pattern is used when you need to automatically enhance or modify
 * DOM elements without requiring manual imports in content files.
 *
 * Real-world examples:
 * - docusaurus-plugin-image-zoom: Adds zoom functionality to images
 * - Copy code button plugins: Adds copy buttons to code blocks
 * - Link decoration plugins: Adds icons to external links
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Check if we're in the browser before doing anything
if (!ExecutionEnvironment.canUseDOM) {
  // Server-side rendering - export empty object
  // @ts-expect-error - intentionally exporting null for SSR
  export default null;
} else {
  // Client-side - export lifecycle hooks
  export default {
    /**
     * onRouteUpdate runs every time the user navigates in the SPA
     * Use this to reinitialize DOM enhancements for newly loaded content
     */
    onRouteUpdate({ location, previousLocation }) {
      // Example: Add zoom functionality to all images in markdown content
      const images = document.querySelectorAll('.markdown img');

      images.forEach((img) => {
        // Skip if already processed
        if (img.classList.contains('zoom-enabled')) {
          return;
        }

        img.classList.add('zoom-enabled');
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', () => {
          // Your zoom implementation here
          console.log('Image clicked:', img.src);
        });
      });
    },

    /**
     * onRouteDidUpdate runs after the route has updated and after onRouteUpdate
     * Use this for operations that should happen after the page is fully rendered
     */
    onRouteDidUpdate({ location, previousLocation }) {
      // Example: Track page views, update scroll position, etc.
      console.log('Navigated to:', location.pathname);
    },
  };
}
