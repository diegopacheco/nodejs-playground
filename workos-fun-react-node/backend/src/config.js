import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { backendDir, rootDir } from './paths.js'

const envFile = join(rootDir, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const isSet = (value) => Boolean(value) && !value.includes('replace_me')

const REQUIRED = ['WORKOS_API_KEY', 'WORKOS_CLIENT_ID']

export const config = {
  host: '127.0.0.1',
  apiPort: Number(process.env.API_PORT ?? 3001),
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  dataFile: process.env.DATA_FILE ?? join(backendDir, 'data', 'gym.json'),
  sessionTtlMs: 12 * 60 * 60 * 1000,
  stateTtlMs: 10 * 60 * 1000,
  workos: {
    apiBase: 'https://api.workos.com',
    apiKey: process.env.WORKOS_API_KEY ?? '',
    clientId: process.env.WORKOS_CLIENT_ID ?? '',
    redirectUri: process.env.WORKOS_REDIRECT_URI ?? 'http://localhost:3000/api/auth/callback'
  }
}

export const assertConfig = () => {
  const missing = REQUIRED.filter((key) => !isSet(process.env[key]))
  if (missing.length > 0) {
    throw new Error(
      `missing WorkOS credentials: ${missing.join(', ')}. run ./scripts/setup.sh then fill in ${envFile}`
    )
  }
  if (!Number.isInteger(config.apiPort) || config.apiPort <= 0) {
    throw new Error(`API_PORT must be a positive integer, got ${process.env.API_PORT}`)
  }
}
