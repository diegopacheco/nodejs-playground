import { useAuth } from '../auth/useAuth.js'

export const Login = () => {
  const { signIn, notice } = useAuth()

  return (
    <main className="login">
      <div className="login-card">
        <span className="brand-mark">GL</span>
        <h1>Gym Log</h1>
        <p>Track every set, every session, on this machine only.</p>
        {notice ? <p className="notice">{notice}</p> : null}
        <button type="button" className="primary" onClick={signIn}>
          Sign in with WorkOS
        </button>
        <small>Runs on 127.0.0.1 and is not reachable from your network.</small>
      </div>
    </main>
  )
}
