import {resolve} from 'path';

import {sentryVitePlugin} from '@sentry/vite-plugin';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

const {env} = process;
env.NODE_ENV = env.NODE_ENV ?? 'development';

// https://vitejs.dev/config/re
export default defineConfig({
  plugins: [
    dts({rollupTypes: true}),
    sentryVitePlugin({
      telemetry: false,
      sourcemaps: {disable: true},
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
