import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { stdlib } from './dist/index'

export default defineConfig({
  root: 'examples',
  plugins: [
    vue(),
    react(),
    stdlib(),
  ],
  build: {
    minify: false,
  },
})
