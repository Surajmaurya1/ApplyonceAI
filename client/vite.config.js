import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: { alias: {
    '@': path.resolve(import.meta.dirname, './src'),
    '@components': path.resolve(import.meta.dirname, './src/components'),
    '@pages': path.resolve(import.meta.dirname, './src/pages'),
    '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
    '@services': path.resolve(import.meta.dirname, './src/services'),
    '@context': path.resolve(import.meta.dirname, './src/context'),
    '@shared': path.resolve(import.meta.dirname, '../shared')
  } },
  server: { port: 5173, proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } }
})
