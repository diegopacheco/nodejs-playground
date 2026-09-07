import { formatMoney } from '../lib/rentals.js'

export function Header({ openCount, overdueCount, balanceCents }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">🎞️</span>
        <div>
          <h1>Reel Deal</h1>
          <p>Movie rental counter</p>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{openCount}</span>
          <span className="stat-label">Out</span>
        </div>
        <div className={overdueCount > 0 ? 'stat stat-alert' : 'stat'}>
          <span className="stat-value">{overdueCount}</span>
          <span className="stat-label">Overdue</span>
        </div>
        <div className="stat">
          <span className="stat-value">{formatMoney(balanceCents)}</span>
          <span className="stat-label">Balance</span>
        </div>
      </div>
    </header>
  )
}
