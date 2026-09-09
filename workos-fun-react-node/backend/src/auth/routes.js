import { config } from '../config.js'
import { sendJson, sendRedirect } from '../http/response.js'
import { clearedSessionCookie, sessionCookie } from './cookies.js'
import { currentSession, sessionIdOf } from './guard.js'
import { consumeState, createSession, destroySession, issueState } from './sessions.js'
import { authenticateWithCode, buildAuthorizationUrl, buildLogoutUrl } from './workos.js'

const failedSignIn = (res, reason) => sendRedirect(res, `${config.appUrl}/?auth=${reason}`)

export const registerAuthRoutes = (router) => {
  router.get('/api/auth/login', ({ res }) => {
    sendRedirect(res, buildAuthorizationUrl(issueState()))
  })

  router.get('/api/auth/callback', async ({ res, query }) => {
    const code = query.get('code')
    if (!code) return failedSignIn(res, 'cancelled')
    if (!consumeState(query.get('state'))) return failedSignIn(res, 'state_mismatch')

    try {
      const { user, workosSessionId } = await authenticateWithCode(code)
      const id = createSession(user, workosSessionId)
      sendRedirect(res, config.appUrl, { 'set-cookie': sessionCookie(id, config.sessionTtlMs) })
    } catch (error) {
      console.error('sign in failed', error.message)
      failedSignIn(res, 'rejected')
    }
  })

  router.get('/api/auth/me', ({ req, res }) => {
    const session = currentSession(req)
    sendJson(res, 200, { user: session ? session.user : null })
  })

  router.post('/api/auth/logout', ({ req, res }) => {
    const session = destroySession(sessionIdOf(req))
    sendJson(
      res,
      200,
      { logoutUrl: buildLogoutUrl(session?.workosSessionId) },
      { 'set-cookie': clearedSessionCookie() }
    )
  })
}
