import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// El backend solo acepta peticiones desde http://localhost:4200 (CORS).
// Por eso el servidor de Vite usa ese puerto y no se cambia el backend.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 4200,
    strictPort: true
  },
  preview: {
    port: 4200,
    strictPort: true
  }
})
