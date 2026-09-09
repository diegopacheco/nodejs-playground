import { useContext } from 'react'
import { AuthContext } from './AuthProvider.jsx'

export const useAuth = () => {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
