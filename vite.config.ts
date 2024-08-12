import {resolve} from 'path';

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import hq from 'alias-hq';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: hq.get('rollup'),
  },
  plugins: [react(), dts({rollupTypes: true, exclude: ['**/*.stories.(ts|tsx)']})],
  build: {
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'SentryToolbar',
      // formats: ['es', 'umd', 'cjs', 'iife'], // single=['es', 'umd'], multi=['es', 'cjs']
      formats: ['iife'],
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
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
