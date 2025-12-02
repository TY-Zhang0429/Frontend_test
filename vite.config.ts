import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Frontend_test/',
  server: {
    proxy: {
      '/api': {
        target: 'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
