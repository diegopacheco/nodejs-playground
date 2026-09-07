export const DAY_MS = 86400000
export const WEEKLY_DISCOUNT_DAYS = 7
export const WEEKLY_DISCOUNT_RATE = 0.2
export const LATE_FEE_RATE = 1.5

export function rentalCost(movie, days) {
  const base = movie.priceCents * days
  if (days < WEEKLY_DISCOUNT_DAYS) return base
  return Math.round(base * (1 - WEEKLY_DISCOUNT_RATE))
}

export function dueAt(rentedAt, days) {
  return rentedAt + days * DAY_MS
}

export function lateDays(rental, now) {
  if (now <= rental.dueAt) return 0
  return Math.ceil((now - rental.dueAt) / DAY_MS)
}

export function lateFeeCents(movie, rental, now) {
  return Math.round(movie.priceCents * LATE_FEE_RATE) * lateDays(rental, now)
}

export function totalDueCents(movie, rental, now) {
  return rental.costCents + lateFeeCents(movie, rental, now)
}

export function availableCopies(movie, rentals) {
  const out = rentals.filter((rental) => rental.movieId === movie.id).length
  return movie.copies - out
}

export function findMovie(movies, id) {
  return movies.find((movie) => movie.id === id)
}

export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function matchesFilters(movie, filters, rentals) {
  const query = filters.query.trim().toLowerCase()
  if (query !== '' && !movie.title.toLowerCase().includes(query)) return false
  if (filters.genre !== 'All' && movie.genre !== filters.genre) return false
  if (filters.availableOnly && availableCopies(movie, rentals) === 0) return false
  return true
}
