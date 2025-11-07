import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'client/index': 'src/client/index.ts',
    'client/CookieContext': 'src/client/CookieContext.tsx',
    'theme/Root': 'src/theme/Root.tsx',
  },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['@docusaurus/ExecutionEnvironment', '@theme-original/Root'],
  esbuildOptions(options) {
    options.logOverride = {
      'empty-import-meta': 'silent',
    }
  },
})
