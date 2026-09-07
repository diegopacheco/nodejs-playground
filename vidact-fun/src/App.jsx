import { useState } from 'react'
import { Catalog } from './components/Catalog.jsx'
import { Filters } from './components/Filters.jsx'
import { Header } from './components/Header.jsx'
import { Rentals } from './components/Rentals.jsx'
import { MOVIES } from './data/movies.js'
import { seedRentals } from './data/seed.js'
import {
  dueAt,
  findMovie,
  lateDays,
  matchesFilters,
  rentalCost,
  totalDueCents,
} from './lib/rentals.js'

const openedAt = Date.now()

export function App() {
  const [rentals, setRentals] = useState(seedRentals(openedAt))
  const [filters, setFilters] = useState({ query: '', genre: 'All', availableOnly: false })

  const visible = MOVIES.filter((movie) => matchesFilters(movie, filters, rentals))
  const overdueCount = rentals.filter((rental) => lateDays(rental, openedAt) > 0).length
  const balanceCents = rentals.reduce(
    (sum, rental) => sum + totalDueCents(findMovie(MOVIES, rental.movieId), rental, openedAt),
    0,
  )

  function rent(movie, days) {
    const rentedAt = Date.now()
    setRentals((current) => [
      ...current,
      {
        id: `${movie.id}-${rentedAt}`,
        movieId: movie.id,
        days,
        rentedAt,
        dueAt: dueAt(rentedAt, days),
        costCents: rentalCost(movie, days),
      },
    ])
  }

  function giveBack(rentalId) {
    setRentals((current) => current.filter((rental) => rental.id !== rentalId))
  }

  return (
    <div className="app">
      <Header
        openCount={rentals.length}
        overdueCount={overdueCount}
        balanceCents={balanceCents}
      />
      <main className="layout">
        <div className="browse">
          <Filters
            filters={filters}
            onChange={setFilters}
            shown={visible.length}
            total={MOVIES.length}
          />
          <Catalog movies={visible} rentals={rentals} onRent={rent} />
        </div>
        <Rentals rentals={rentals} movies={MOVIES} now={openedAt} onReturn={giveBack} />
      </main>
    </div>
  )
}
