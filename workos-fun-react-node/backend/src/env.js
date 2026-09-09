import { readFileSync } from 'node:fs'

const unquote = (value) => {
  const quoted =
    value.length > 1 &&
    ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
  return quoted ? value.slice(1, -1) : value
}

export const parseEnvFile = (path) => {
  let raw
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return {}
  }

  const values = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (trimmed === '' || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 1) continue
    values[trimmed.slice(0, separator).trim()] = unquote(trimmed.slice(separator + 1).trim())
  }
  return values
}

export const readerFor = (values) => (key, fallback = '') => values[key] ?? process.env[key] ?? fallback
