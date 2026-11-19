import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const API_BASE = isProd
    ? 'https://imc-nine-ebon.vercel.app/api'
    : '/api';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(API_BASE),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
