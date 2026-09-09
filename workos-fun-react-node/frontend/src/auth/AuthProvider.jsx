import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { LOGIN_URL, api } from '../api/client.js'

export const AuthContext = createContext(null)

const reasonMessages = {
  cancelled: 'Sign in was cancelled.',
  state_mismatch: 'Sign in expired, please try again.',
  rejected: 'WorkOS rejected the sign in.'
}

const readAuthReason = () => {
  const reason = new URLSearchParams(window.location.search).get('auth')
  if (reason) window.history.replaceState({}, '', window.location.pathname)
  return reason ? (reasonMessages[reason] ?? 'Sign in failed.') : ''
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')
  const [notice, setNotice] = useState(readAuthReason)

  useEffect(() => {
    api
      .me()
      .then((payload) => {
        setUser(payload.user)
        setStatus(payload.user ? 'signed-in' : 'signed-out')
      })
      .catch(() => setStatus('signed-out'))
  }, [])

  const signIn = useCallback(() => {
    window.location.href = LOGIN_URL
  }, [])

  const signOut = useCallback(async () => {
    const { logoutUrl } = await api.logout()
    window.location.href = logoutUrl
  }, [])

  const value = useMemo(
    () => ({ user, status, notice, signIn, signOut }),
    [user, status, notice, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
