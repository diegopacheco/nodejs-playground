import { readCookies } from '../http/request.js'
import { unauthorized } from '../http/errors.js'
import { SESSION_COOKIE } from './cookies.js'
import { readSession } from './sessions.js'

export const sessionIdOf = (req) => readCookies(req)[SESSION_COOKIE] ?? ''

export const currentSession = (req) => readSession(sessionIdOf(req))

export const protect = (handler) => (context) => {
  const session = currentSession(context.req)
  if (!session) throw unauthorized()
  return handler({ ...context, user: session.user })
}
