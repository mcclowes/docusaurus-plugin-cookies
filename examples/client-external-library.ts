/**
 * Example: Integrating External Libraries
 *
 * This pattern shows how to integrate third-party libraries that need to
 * initialize/reinitialize on route changes.
 *
 * Real-world examples:
 * - medium-zoom for image zoom
 * - highlight.js for code syntax highlighting
 * - mermaid for diagram rendering
 * - search libraries like DocSearch
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Example: Using medium-zoom library
// import mediumZoom from 'medium-zoom';

interface ZoomOptions {
  selector?: string;
  margin?: number;
  background?: string;
  scrollOffset?: number;
}

let zoom: any = null;

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate({ location }) {
      // Clean up previous zoom instance if it exists
      if (zoom) {
        zoom.detach();
      }

      // Configuration for the zoom library
      const options: ZoomOptions = {
        selector: '.markdown img',
        margin: 24,
        background: 'rgba(0, 0, 0, 0.9)',
        scrollOffset: 0,
      };

      // Initialize zoom on next tick to ensure DOM is ready
      setTimeout(() => {
        const images = document.querySelectorAll(options.selector || 'img');
        if (images.length > 0) {
          // zoom = mediumZoom(options.selector, options);
          console.log(`Initialized zoom for ${images.length} images`);
        }
      }, 100);
    },

    onRouteDidUpdate() {
      // Additional cleanup or tracking can go here
    },
  };
})();
