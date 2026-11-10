
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        catalogo: resolve(__dirname, 'catalogo.html'),
        profile: resolve(__dirname, 'profile.html'),
        admin: resolve(__dirname, 'admin/admin.html')
      }
    }
  }
});
