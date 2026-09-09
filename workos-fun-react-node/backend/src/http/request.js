import { badRequest } from './errors.js'

const MAX_BODY_BYTES = 256 * 1024

export const readJson = async (req) => {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw badRequest('request body is too large')
    chunks.push(chunk)
  }
  if (chunks.length === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw badRequest('request body is not valid JSON')
  }
}

export const readCookies = (req) => {
  const jar = {}
  const header = req.headers.cookie
  if (!header) return jar
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    jar[part.slice(0, separator).trim()] = decodeURIComponent(part.slice(separator + 1).trim())
  }
  return jar
}
