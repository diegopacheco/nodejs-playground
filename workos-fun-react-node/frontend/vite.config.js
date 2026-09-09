import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = join(rootDir, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const apiPort = Number(process.env.API_PORT ?? 3001)

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': { target: `http://127.0.0.1:${apiPort}` }
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true
  }
})
