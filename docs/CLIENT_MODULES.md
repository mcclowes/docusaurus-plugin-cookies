# Client Modules in Docusaurus Plugins

## Overview

Client modules are JavaScript/TypeScript files that run in the browser (client-side) as part of your Docusaurus site. They allow plugins to add global behavior without requiring manual imports in content files.

## How Client Modules Work

### 1. The `getClientModules()` Lifecycle Hook

In your plugin definition (`src/plugin.ts`), return an array of module paths:

```typescript
export default function myPlugin(context, options): Plugin {
  return {
    name: 'my-plugin',
    getClientModules() {
      return [
        require.resolve('./client'), // Points to src/client/index.ts
      ];
    },
  };
}
```

### 2. What Happens Behind the Scenes

- Docusaurus imports these modules **globally** during the build process
- They're bundled into the client-side JavaScript
- They load **before** React renders the initial UI
- They run on **every page** of your site

### 3. No Manual Imports Needed

This is the key advantage: content authors don't need to import anything. Your plugin's client module runs automatically, watching for DOM elements to enhance.

```markdown
<!-- In docs/my-page.md -->
![An image](./image.png)
<!-- Your plugin can automatically add zoom to this image -->
<!-- No imports needed! -->
```

## Client Module Lifecycle Hooks

Client modules can export lifecycle functions that Docusaurus calls at specific times:

### `onRouteUpdate({ location, previousLocation })`

Called **during** route navigation (before the page fully renders):

```typescript
export default {
  onRouteUpdate({ location, previousLocation }) {
    console.log('Navigating to:', location.pathname);
    // Use for: DOM manipulation, initializing libraries
  },
};
```

**When to use:**
- Initializing or reinitializing third-party libraries
- DOM manipulation (add classes, event listeners)
- Cleaning up from previous route

### `onRouteDidUpdate({ location, previousLocation })`

Called **after** route navigation completes:

```typescript
export default {
  onRouteDidUpdate({ location, previousLocation }) {
    // Use for: Analytics, scroll restoration, post-render tasks
  },
};
```

**When to use:**
- Analytics tracking
- Scroll position restoration
- Operations that need fully rendered DOM

## Common Patterns

### Pattern 1: DOM Enhancement (Image Zoom Example)

This is the pattern used by `docusaurus-plugin-image-zoom`:

```typescript
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import mediumZoom from 'medium-zoom';

export default (function() {
  // Only run in browser, not during SSR
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate({ location }) {
      // Reinitialize zoom on every route change
      const selector = '.markdown img';
      mediumZoom(selector, {
        margin: 24,
        background: 'rgba(0, 0, 0, 0.9)',
      });
    }
  };
})();
```

**Key principles:**
1. Check `ExecutionEnvironment.canUseDOM` to avoid SSR errors
2. Use DOM selectors to find target elements
3. Reinitialize on each route change (SPA navigation)

### Pattern 2: Global Event Listeners

For behavior that should persist across routes:

```typescript
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

let initialized = false;

export default (function() {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate() {
      if (!initialized) {
        // Attach global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
          if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            // Open search
          }
        });
        initialized = true;
      }
    }
  };
})();
```

### Pattern 3: Using Plugin Options

Pass configuration from plugin to client:

```typescript
// In plugin.ts
export default function myPlugin(context, options) {
  return {
    name: 'my-plugin',

    async contentLoaded({ actions }) {
      // Inject options into global data
      actions.setGlobalData({
        pluginOptions: options
      });
    },

    getClientModules() {
      return [require.resolve('./client')];
    },
  };
}

// In client/index.ts
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default (function() {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate() {
      // Access options from global data
      const globalData = (window as any).docusaurus?.globalData;
      const options = globalData?.['my-plugin']?.default?.pluginOptions;

      if (options?.enabled) {
        // Do something based on config
      }
    }
  };
})();
```

## Best Practices

### 1. Always Check for Browser Environment

```typescript
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (!ExecutionEnvironment.canUseDOM) {
  export default null;
}
```

This prevents Node.js APIs from being called during SSR.

### 2. Clean Up Previous Instances

When using libraries that need reinitialization:

```typescript
let instance = null;

export default {
  onRouteUpdate() {
    // Clean up previous instance
    if (instance) {
      instance.destroy();
    }

    // Create new instance
    instance = initializeLibrary();
  }
};
```

### 3. Use setTimeout for DOM-Dependent Code

Sometimes you need to wait for the DOM to be fully ready:

```typescript
onRouteUpdate() {
  setTimeout(() => {
    const elements = document.querySelectorAll('.my-selector');
    // Now elements are guaranteed to exist
  }, 0);
}
```

### 4. Avoid Server-Only Imports

Never import Node.js modules in client code:

```typescript
// ❌ BAD - fs doesn't exist in browser
import fs from 'fs';

// ✅ GOOD - browser-safe imports only
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
```

### 5. Keep Client Bundles Small

Client modules increase bundle size. Only import what you need:

```typescript
// ❌ BAD - imports entire library
import _ from 'lodash';

// ✅ GOOD - imports only what you need
import debounce from 'lodash/debounce';
```

## Debugging Tips

### 1. Check if Module is Loading

```typescript
export default {
  onRouteUpdate() {
    console.log('[my-plugin] Client module loaded');
  }
};
```

### 2. Verify DOM Selectors

```typescript
onRouteUpdate() {
  const elements = document.querySelectorAll('.my-selector');
  console.log(`Found ${elements.length} elements`);
}
```

### 3. Test SSR Safety

Build your site and check for errors:

```bash
npm run build
npm run serve
```

If you see errors about `window` or `document` not being defined, you forgot to check `ExecutionEnvironment.canUseDOM`.

## Real-World Examples

Study these plugins to see client modules in action:

- **docusaurus-plugin-image-zoom**: DOM enhancement with medium-zoom
- **@docusaurus/plugin-google-gtag**: Analytics tracking
- **@docusaurus/plugin-pwa**: Service worker registration
- **docusaurus-lunr-search**: Search initialization

## Further Reading

- [Docusaurus Plugin Lifecycle API](https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis)
- [Client Modules Documentation](https://docusaurus.io/docs/advanced/client#client-modules)
- [ExecutionEnvironment API](https://docusaurus.io/docs/docusaurus-core#executionenvironment)
