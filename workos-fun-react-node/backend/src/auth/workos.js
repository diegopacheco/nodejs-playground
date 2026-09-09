import { config } from '../config.js'
import { unauthorized, upstreamFailure } from '../http/errors.js'

const endpoint = (path) => `${config.workos.apiBase}${path}`

const decodeTokenPayload = (token) => {
  const segment = typeof token === 'string' ? token.split('.')[1] : null
  if (!segment) return {}
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'))
  } catch {
    return {}
  }
}

const toProfile = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name ?? '',
  lastName: user.last_name ?? '',
  pictureUrl: user.profile_picture_url ?? ''
})

export const buildAuthorizationUrl = (state) => {
  const url = new URL(endpoint('/user_management/authorize'))
  url.searchParams.set('client_id', config.workos.clientId)
  url.searchParams.set('redirect_uri', config.workos.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('provider', 'authkit')
  url.searchParams.set('state', state)
  return url.toString()
}

export const buildLogoutUrl = (workosSessionId) => {
  if (!workosSessionId) return config.appUrl
  const url = new URL(endpoint('/user_management/sessions/logout'))
  url.searchParams.set('session_id', workosSessionId)
  url.searchParams.set('return_to', config.appUrl)
  return url.toString()
}

export const authenticateWithCode = async (code) => {
  let response
  try {
    response = await fetch(endpoint('/user_management/authenticate'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.workos.clientId,
        client_secret: config.workos.apiKey,
        code
      })
    })
  } catch (error) {
    console.error('workos authenticate is unreachable', error.message)
    throw upstreamFailure('could not reach workos')
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || !payload.user) {
    console.error('workos rejected the authorization code', response.status, payload.code ?? payload.error ?? '')
    throw unauthorized('sign in was rejected')
  }

  return {
    user: toProfile(payload.user),
    workosSessionId: decodeTokenPayload(payload.access_token).sid ?? ''
  }
}
