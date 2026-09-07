import { useState } from 'react'
import { WEEKLY_DISCOUNT_DAYS, formatMoney, rentalCost } from '../lib/rentals.js'

const DAY_CHOICES = [1, 3, 5, 7, 14]

export function MovieCard({ movie, available, onRent }) {
  const [days, setDays] = useState(3)
  const cost = rentalCost(movie, days)
  const discounted = days >= WEEKLY_DISCOUNT_DAYS

  return (
    <article className={available === 0 ? 'card card-out' : 'card'}>
      <div className="poster">
        <span>{movie.art}</span>
      </div>
      <div className="card-body">
        <h3>{movie.title}</h3>
        <p className="meta">
          {movie.year} · {movie.genre} · ★ {movie.rating.toFixed(1)}
        </p>
        <p className="stock">
          {available > 0 ? `${available} of ${movie.copies} in stock` : 'All copies out'}
        </p>
        <div className="rent-row">
          <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
            {DAY_CHOICES.map((choice) => (
              <option key={choice} value={choice}>
                {choice} {choice === 1 ? 'day' : 'days'}
              </option>
            ))}
          </select>
          <button type="button" disabled={available === 0} onClick={() => onRent(movie, days)}>
            Rent {formatMoney(cost)}
          </button>
        </div>
        {discounted ? <p className="deal">Weekly rate applied</p> : null}
      </div>
    </article>
  )
}
