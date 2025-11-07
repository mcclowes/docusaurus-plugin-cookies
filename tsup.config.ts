import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'client/index': 'src/client/index.ts',
  },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['./client', '@docusaurus/ExecutionEnvironment'],
  esbuildOptions(options) {
    options.logOverride = {
      'empty-import-meta': 'silent',
    }
  },
})
