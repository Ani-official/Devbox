import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // vite-react-ssg injects Helmet-managed <title>/meta tags at the start of
  // <head>, which pushes the template's <meta charset> past the 1024-byte limit
  // the HTML spec requires. Re-hoist charset to be the first tag in <head>.
  ssgOptions: {
    onPageRendered(_route: string, html: string) {
      const charset = '<meta charset="UTF-8">';
      return html
        .replace(/<meta charset=["']?[^"'>]+["']?\s*\/?>/i, "")
        .replace(/<head>/i, `<head>${charset}`);
    },
  },
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
