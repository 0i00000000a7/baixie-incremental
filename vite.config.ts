import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  base: process.env.NODE_ENV === 'production' ? '/baixie-incremental/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '~BE': fileURLToPath(new URL('./src/utils/break_eternity.js', import.meta.url)),
      '~format': fileURLToPath(new URL('./src/utils/format.js', import.meta.url)),
    },
  },
  server: {
    // host: "::",
    port: 5173,
    strictPort: true,
  }
})
