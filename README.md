# Docusaurus Plugin Starter (TypeScript)

A minimal, strongly-typed starter for building and publishing Docusaurus v2 plugins.

- Build with TypeScript and `tsup`
- ESM and CJS outputs
- Typed options, example lifecycle hooks, client module wiring
- Clear instructions to extend, test locally, and publish to npm
- Guidance for AI assistants (Cursor, Anthropic Claude, OpenAI Codex/GPT) on Docusaurus and plugin development

## Quick start

```bash
# Install deps
npm install

# Build once
npm run build

# Watch and rebuild on change
npm run dev
```

## Install into a local Docusaurus site

From your Docusaurus site:

```bash
# Using a local path during development
npm install ../path/to/docusaurus-plugin-starter

# Or via a temporary tarball
npm pack ../path/to/docusaurus-plugin-starter
npm install ./docusaurus-plugin-starter-*.tgz
```

Add to `docusaurus.config.js` or `docusaurus.config.ts`:

```js
// docusaurus.config.js
module.exports = {
  // ... existing config ...
  plugins: [
    [
      'docusaurus-plugin-starter',
      {
        enabled: true,
        greetingMessage: 'Hello from my plugin!'
      }
    ]
  ]
}
```

Access global data set by the plugin from any theme component:

```js
// Example React component
import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Greeting() {
  const { globalData } = useDocusaurusContext()
  const data = globalData['docusaurus-plugin-starter']?.default
  return <div>{data?.greeting}</div>
}
```

## What this starter includes

- `src/plugin.ts`: Minimal plugin implementing `loadContent`, `contentLoaded`, and `getClientModules`
- `src/client/index.ts`: Demonstration client module (executed in the browser)
- `src/types.ts`: Typed plugin options
- `tsup.config.ts`: Bundling to CJS and ESM with type declarations
- `package.json` exports for both server and client entry points
- `examples/`: Complete client module patterns for common use cases
- `docs/CLIENT_MODULES.md`: Comprehensive guide to client modules and lifecycle hooks

## Extend the plugin

### Common Additions

- **Add plugin options**: Extend `PluginStarterOptions` in `src/types.ts`
- **Emit data at build time**: Return from `loadContent()`
- **Inject global data or routes**: Use `contentLoaded({ actions })`
- **Add client behavior**: Export lifecycle functions from `src/client/index.ts`
- **Integrate with Webpack**: Implement `configureWebpack()` in `src/plugin.ts`
- **Provide theme components**: Return `getThemePath()` or `getTypeScriptThemePath()`

### Example: Add a Simple Route

```ts
// In src/plugin.ts inside contentLoaded
async contentLoaded({ actions }) {
  const { addRoute } = actions
  addRoute({
    path: '/hello-plugin',
    component: require.resolve('./client/HelloPage')
  })
}
```

Then create `src/client/HelloPage.tsx` and export a React component. The path will be available at `/hello-plugin` when the site runs.

### Example: Automatic DOM Enhancement (No Manual Imports)

This pattern allows your plugin to enhance content automatically, just like `docusaurus-plugin-image-zoom`:

```ts
// In src/plugin.ts
export default function myPlugin(context, options): Plugin {
  return {
    name: 'my-plugin',
    getClientModules() {
      // Return path to client module
      return [require.resolve('./client')];
    },
  };
}

// In src/client/index.ts
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default (function() {
  // Only run in browser, not during SSR
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate({ location }) {
      // This runs on every route change
      const images = document.querySelectorAll('.markdown img');
      images.forEach(img => {
        // Enhance images automatically
        img.classList.add('enhanced');
      });
    }
  };
})();
```

**Why this works:** Docusaurus bundles your client module globally. It runs on every page, using DOM selectors to find and enhance elements automatically—no imports needed in markdown files.

See `docs/CLIENT_MODULES.md` for comprehensive patterns and the `examples/` directory for complete implementations.

## Publish to npm

1. Update metadata in `package.json`:
   - name: `@yourscope/docusaurus-plugin-xyz`
   - version: semantic version
   - description, repository, author, homepage, bugs
2. Build the package:
   ```bash
   npm run build
   ```
3. Login and publish:
   ```bash
   npm login
   npm publish --access public
   ```

Notes:
- The published package includes only `dist/`, `README.md`, and `LICENSE` (see `files` and `.npmignore`).
- `prepublishOnly` ensures a fresh build.

## Conventions and tips

- Keep server-only code (Node.js) out of `src/client`.
- Feature-flag behavior via `enabled` or other options.
- Prefer `setGlobalData` over ad-hoc globals.
- Use `peerDependencies` for `@docusaurus/types` to avoid duplicate installs.

## API surface (starter)

- Default export: the plugin function `(context, options) => Plugin`
- Types: `PluginStarterOptions`
- Client module: `client/index` with `onRouteDidUpdate` example

## For AI assistants (Cursor, Claude, Codex/GPT)

### What is Docusaurus?

Docusaurus is a React/MDX static site generator. A "plugin" runs during build/serve in Node.js and can:
- Load content (files, data sources)
- Create routes/pages and inject global data
- Provide client modules that run in the browser
- Optionally provide theme components (UI) for the site

### How to Build a Plugin

**Implement plugin hooks in `src/plugin.ts`:**
- `loadContent()` → read/process data at build time
- `contentLoaded({content, actions})` → create routes or set global data
- `getClientModules()` → return paths to client-side modules
- Optional: `getThemePath()`, `getTypeScriptThemePath()`, `configureWebpack()`

**Define typed options:**
- Extend `PluginStarterOptions` in `src/types.ts`
- Re-export from `src/index.ts`

**Client-side code:**
- Place all browser code under `src/client/`
- Use browser-safe APIs only
- Never import Node.js modules (`fs`, `path`, etc.)

### Client Modules: Automatic Enhancement Pattern

**The `getClientModules()` hook enables automatic DOM enhancement without manual imports:**

```typescript
// Plugin registers client module
getClientModules() {
  return [require.resolve('./client')];
}

// Client module runs globally on all pages
export default (function() {
  if (!ExecutionEnvironment.canUseDOM) return null;

  return {
    onRouteUpdate({ location }) {
      // Enhance DOM automatically - no imports needed in content files
      document.querySelectorAll('.markdown img').forEach(img => {
        // Add functionality to images
      });
    }
  };
})();
```

**Key principles:**
1. **Global execution**: Client modules run on every page automatically
2. **DOM selectors**: Use CSS selectors to find elements (e.g., `.markdown img`)
3. **Lifecycle hooks**: `onRouteUpdate` runs on every route change (SPA navigation)
4. **SSR safety**: Always check `ExecutionEnvironment.canUseDOM` before accessing browser APIs
5. **No manual imports**: Content authors don't import anything—the plugin "just works"

**Common patterns:**
- **DOM manipulation**: Add zoom to images, copy buttons to code blocks
- **Event listeners**: Global keyboard shortcuts, scroll tracking
- **External libraries**: Initialize third-party libraries (medium-zoom, highlight.js)
- **Conditional logic**: Use plugin options to enable/disable features

**See comprehensive examples:**
- `docs/CLIENT_MODULES.md` - Full guide with patterns and best practices
- `examples/` directory - Complete working examples for common use cases

### Testing Locally

- Link into a Docusaurus site: `npm install ../path` or `npm pack`
- Inspect `globalData` via `@docusaurus/useDocusaurusContext`
- Check browser console for client module output
- Build and serve to test SSR: `npm run build && npm run serve`

### Publishing Checklist

- Update `package.json` metadata
- Run `npm run build`
- Publish: `npm publish --access public`
- Consider CI automation (e.g., Changesets)

### Guardrails for Assistants

- ❌ Never import server-only modules (`fs`, `path`) into `src/client/*`
- ✅ Always check `ExecutionEnvironment.canUseDOM` in client modules
- ✅ Keep plugin entry point at `src/index.ts` with default export
- ✅ Preserve ESM/CJS dual output in `package.json` `exports`
- ✅ Update `tsup.config.ts` if adding new entry points
- ✅ Use `setTimeout` if DOM elements might not be immediately available

## License

MIT

