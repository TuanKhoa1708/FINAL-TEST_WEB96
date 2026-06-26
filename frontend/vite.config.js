import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls during development so CORS is never an issue
    proxy: {
      '/teachers': 'http://localhost:3000',
      '/teacher-positions': 'http://localhost:3000',
    },
  },
});
