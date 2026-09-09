import { createServer } from 'node:http'
import { forbidden, notFound } from './errors.js'
import { sendError } from './response.js'

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

const isLoopback = (host) => {
  if (!host) return false
  return LOOPBACK_HOSTS.has(host.replace(/:\d+$/, ''))
}

export const createApiServer = (router) =>
  createServer(async (req, res) => {
    try {
      if (!isLoopback(req.headers.host)) throw forbidden('this api only answers loopback clients')
      const url = new URL(req.url, 'http://127.0.0.1')
      const route = router.match(req.method, url.pathname)
      if (!route) throw notFound(`no route for ${req.method} ${url.pathname}`)
      await route.handler({ req, res, params: route.params, query: url.searchParams })
    } catch (error) {
      sendError(res, error)
    }
  })
