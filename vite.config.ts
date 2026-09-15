import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/matteglim/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
}))
