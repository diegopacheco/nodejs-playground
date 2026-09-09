import { useAuth } from './auth/useAuth.js'
import { Dashboard } from './pages/Dashboard.jsx'
import { Login } from './pages/Login.jsx'

export const App = () => {
  const { status } = useAuth()

  if (status === 'loading') return <div className="boot">Loading</div>

  return status === 'signed-in' ? <Dashboard /> : <Login />
}
