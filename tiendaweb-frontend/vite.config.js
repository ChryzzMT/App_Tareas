import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// React + Vite, en JavaScript, como el gestor de referencia.
// Los estilos son CSS propio: no se usa Tailwind.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
});
