import { HttpError } from './errors.js'
import { ValidationError } from '../types/schema.js'

const baseHeaders = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer'
}

export const sendJson = (res, status, body, headers = {}) => {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    ...baseHeaders,
    ...headers,
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload)
  })
  res.end(payload)
}

export const sendRedirect = (res, location, headers = {}) => {
  res.writeHead(302, { ...baseHeaders, ...headers, location })
  res.end()
}

export const sendError = (res, error) => {
  if (error instanceof ValidationError) {
    sendJson(res, 422, { error: error.message, issues: error.issues })
    return
  }
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: error.message })
    return
  }
  console.error('unhandled request failure', error)
  sendJson(res, 500, { error: 'internal error' })
}
