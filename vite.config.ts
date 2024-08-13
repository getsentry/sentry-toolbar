import {resolve} from 'path';

import react from '@vitejs/plugin-react';
import hq from 'alias-hq';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const {env} = process;
env.NODE_ENV = env.NODE_ENV ?? 'development';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: hq.get('rollup'),
  },
  plugins: [react(), dts({rollupTypes: true, exclude: ['**/*.stories.(ts|tsx)']})],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'SentryToolbar',
      formats: ['iife'],
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        intro: () => {
          return 'exports = window.SentryToolbar || {};';
        },
      },
      context: 'window',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
