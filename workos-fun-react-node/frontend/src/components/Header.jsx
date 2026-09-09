import { useAuth } from '../auth/useAuth.js'

const displayName = (user) => [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

export const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-mark">GL</span>
        <h1>Gym Log</h1>
      </div>
      <div className="header-user">
        {user.pictureUrl ? <img src={user.pictureUrl} alt="" /> : <span className="avatar">{displayName(user)[0]}</span>}
        <div>
          <strong>{displayName(user)}</strong>
          <small>{user.email}</small>
        </div>
        <button type="button" className="ghost" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
