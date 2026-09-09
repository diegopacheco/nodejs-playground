import { strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { HttpError } from '../http/errors.js'
import { SESSION_COOKIE } from './cookies.js'
import { protect } from './guard.js'
import { createSession, destroySession } from './sessions.js'

const requestWith = (cookie) => ({ headers: cookie ? { cookie } : {} })

const handler = protect(({ user }) => user.email)

test('a request with no session cookie is rejected before the handler runs', () => {
  throws(() => handler({ req: requestWith(null) }), (error) => error instanceof HttpError && error.status === 401)
})

test('a forged session id is rejected because ids only exist in the server store', () => {
  throws(() => handler({ req: requestWith(`${SESSION_COOKIE}=forged`) }), (error) => error.status === 401)
})

test('a real session hands the handler the user the cookie belongs to', () => {
  const id = createSession({ id: 'user_a', email: 'a@local' }, 'session_1')
  strictEqual(handler({ req: requestWith(`${SESSION_COOKIE}=${id}`) }), 'a@local')
})

test('a logged out session id stops working immediately', () => {
  const id = createSession({ id: 'user_a', email: 'a@local' }, 'session_1')
  destroySession(id)
  throws(() => handler({ req: requestWith(`${SESSION_COOKIE}=${id}`) }), (error) => error.status === 401)
})
