import { DAY_MS, dueAt, rentalCost } from '../lib/rentals.js'
import { MOVIES } from './movies.js'

const OPEN_RENTALS = [
  { movieId: 'mad-max-fury-road', days: 2, startedDaysAgo: 5 },
  { movieId: 'spirited-away', days: 5, startedDaysAgo: 1 },
]

export function seedRentals(now) {
  return OPEN_RENTALS.map((entry) => {
    const movie = MOVIES.find((candidate) => candidate.id === entry.movieId)
    const rentedAt = now - entry.startedDaysAgo * DAY_MS
    return {
      id: `${entry.movieId}-${rentedAt}`,
      movieId: entry.movieId,
      days: entry.days,
      rentedAt,
      dueAt: dueAt(rentedAt, entry.days),
      costCents: rentalCost(movie, entry.days),
    }
  })
}
