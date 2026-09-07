import { defineConfig } from 'vite'
import { vidact } from '@vidact/vite'

export default defineConfig({
  plugins: [vidact({ extensions: ['.jsx'] })],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
})
