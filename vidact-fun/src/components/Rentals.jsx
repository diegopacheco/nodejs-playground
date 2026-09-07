import {
  formatDate,
  formatMoney,
  lateDays,
  lateFeeCents,
  totalDueCents,
} from '../lib/rentals.js'

function RentalRow({ rental, movie, now, onReturn }) {
  const late = lateDays(rental, now)
  return (
    <li className={late > 0 ? 'rental rental-late' : 'rental'}>
      <span className="rental-art">{movie.art}</span>
      <div className="rental-info">
        <strong>{movie.title}</strong>
        <span className="meta">Due {formatDate(rental.dueAt)}</span>
        {late > 0 ? (
          <span className="late">
            {late} {late === 1 ? 'day' : 'days'} late · +{formatMoney(lateFeeCents(movie, rental, now))}
          </span>
        ) : null}
      </div>
      <div className="rental-actions">
        <span className="amount">{formatMoney(totalDueCents(movie, rental, now))}</span>
        <button type="button" onClick={() => onReturn(rental.id)}>
          Return
        </button>
      </div>
    </li>
  )
}

export function Rentals({ rentals, movies, now, onReturn }) {
  return (
    <aside className="rentals">
      <h2>Your shelf</h2>
      {rentals.length === 0 ? (
        <p className="empty">Nothing rented yet.</p>
      ) : (
        <ul className="rental-list">
          {rentals.map((rental) => (
            <RentalRow
              key={rental.id}
              rental={rental}
              movie={movies.find((movie) => movie.id === rental.movieId)}
              now={now}
              onReturn={onReturn}
            />
          ))}
        </ul>
      )}
    </aside>
  )
}
