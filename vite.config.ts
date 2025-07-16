import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
plugins: [react(), tailwindcss()],
  base: '/Mittweida/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'docs'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts']
  }
})