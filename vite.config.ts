import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        // Manual vendor chunks only make sense for the client bundle. During the
        // SSR/prerender pass these packages are external, so applying manualChunks
        // there errors out ("react cannot be included in manualChunks").
        manualChunks: isSsrBuild
          ? undefined
          : {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'motion': ['framer-motion'],
              'syntax': ['react-syntax-highlighter'],
              'yaml': ['js-yaml'],
            },
      },
    },
  },
}))
