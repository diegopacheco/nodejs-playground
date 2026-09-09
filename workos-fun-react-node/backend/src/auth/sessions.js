import { randomBytes } from 'node:crypto'
import { config } from '../config.js'

const sessions = new Map()
const states = new Map()

const opaqueId = () => randomBytes(32).toString('base64url')

const alive = (expiresAt) => expiresAt > Date.now()

export const createSession = (user, workosSessionId) => {
  const id = opaqueId()
  sessions.set(id, { user, workosSessionId, expiresAt: Date.now() + config.sessionTtlMs })
  return id
}

export const readSession = (id) => {
  if (!id) return null
  const session = sessions.get(id)
  if (!session) return null
  if (!alive(session.expiresAt)) {
    sessions.delete(id)
    return null
  }
  return session
}

export const destroySession = (id) => {
  const session = readSession(id)
  if (id) sessions.delete(id)
  return session
}

export const issueState = () => {
  const state = opaqueId()
  states.set(state, Date.now() + config.stateTtlMs)
  return state
}

export const consumeState = (state) => {
  if (!state) return false
  const expiresAt = states.get(state)
  states.delete(state)
  return Boolean(expiresAt) && alive(expiresAt)
}
