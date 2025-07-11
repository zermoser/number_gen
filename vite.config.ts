import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/number_gen/',
  server: {
    open: true,
    port: 3019
  }
});
