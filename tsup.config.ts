import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'client/index': 'src/client/index.ts',
    'theme/Root': 'src/theme/Root.tsx',
  },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['@docusaurus/ExecutionEnvironment', '@docusaurus/BrowserOnly', '@theme-original/Root'],
  esbuildOptions(options) {
    options.logOverride = {
      'empty-import-meta': 'silent',
    }
  },
})
