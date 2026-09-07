import { availableCopies } from '../lib/rentals.js'
import { MovieCard } from './MovieCard.jsx'

export function Catalog({ movies, rentals, onRent }) {
  if (movies.length === 0) {
    return <p className="empty">No titles match those filters.</p>
  }
  return (
    <section className="catalog">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          available={availableCopies(movie, rentals)}
          onRent={onRent}
        />
      ))}
    </section>
  )
}
