
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist-vite',
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    port: 3002,
    open: false
  }
});
        