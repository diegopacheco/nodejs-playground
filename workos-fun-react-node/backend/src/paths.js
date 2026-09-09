import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const backendDir = join(dirname(fileURLToPath(import.meta.url)), '..')
export const rootDir = join(backendDir, '..')
