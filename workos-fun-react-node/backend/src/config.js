import { join } from 'node:path'
import { parseEnvFile, readerFor } from './env.js'
import { backendDir, rootDir } from './paths.js'

const envFile = join(rootDir, '.env')
const fileValues = parseEnvFile(envFile)
const read = readerFor(fileValues)

const isSet = (value) => Boolean(value) && !value.includes('replace_me')

const REQUIRED = ['WORKOS_API_KEY', 'WORKOS_CLIENT_ID']

export const config = {
  host: '127.0.0.1',
  apiPort: Number(read('API_PORT', '3001')),
  appUrl: read('APP_URL', 'http://localhost:3000'),
  dataFile: read('DATA_FILE', join(backendDir, 'data', 'gym.json')),
  sessionTtlMs: 12 * 60 * 60 * 1000,
  stateTtlMs: 10 * 60 * 1000,
  workos: {
    apiBase: 'https://api.workos.com',
    apiKey: read('WORKOS_API_KEY'),
    clientId: read('WORKOS_CLIENT_ID'),
    redirectUri: read('WORKOS_REDIRECT_URI', 'http://localhost:3000/api/auth/callback')
  }
}

export const assertConfig = () => {
  const missing = REQUIRED.filter((key) => !isSet(read(key)))
  if (missing.length > 0) {
    throw new Error(
      `missing WorkOS credentials: ${missing.join(', ')}. run ./scripts/setup.sh then fill in ${envFile}`
    )
  }
  if (!Number.isInteger(config.apiPort) || config.apiPort <= 0) {
    throw new Error(`API_PORT must be a positive integer, got ${read('API_PORT')}`)
  }
  const shadowed = REQUIRED.filter((key) => fileValues[key] && process.env[key] && fileValues[key] !== process.env[key])
  if (shadowed.length > 0) {
    console.warn(`${envFile} wins over the exported ${shadowed.join(', ')} in your shell`)
  }
}
