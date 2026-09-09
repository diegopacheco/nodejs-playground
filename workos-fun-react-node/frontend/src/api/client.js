export class ApiError extends Error {
  constructor(status, message, issues) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

const request = async (method, path, body) => {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, payload?.error ?? 'request failed', payload?.issues ?? [])
  }

  return payload
}

export const api = {
  me: () => request('GET', '/api/auth/me'),
  logout: () => request('POST', '/api/auth/logout'),
  exercises: () => request('GET', '/api/exercises'),
  workouts: () => request('GET', '/api/workouts'),
  createWorkout: (draft) => request('POST', '/api/workouts', draft),
  deleteWorkout: (id) => request('DELETE', `/api/workouts/${encodeURIComponent(id)}`),
  stats: () => request('GET', '/api/stats')
}

export const LOGIN_URL = '/api/auth/login'
