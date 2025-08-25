import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { copy } from 'vite-plugin-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    copy({
      patterns: [
        { from: 'public/_redirects', to: 'dist' }
      ]
    })
  ],
  base: '/',
  server: {
    port: 3000,
    host: true,
    historyApiFallback: true
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    outDir: 'dist'
  },
  publicDir: 'public'
})
