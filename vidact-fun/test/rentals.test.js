import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MOVIES } from '../src/data/movies.js'
import {
  DAY_MS,
  availableCopies,
  dueAt,
  findMovie,
  formatMoney,
  lateDays,
  lateFeeCents,
  matchesFilters,
  rentalCost,
  totalDueCents,
} from '../src/lib/rentals.js'

const movie = { id: 'm', title: 'Heat', genre: 'Action', priceCents: 300, copies: 2 }

test('a short rental is billed at the daily rate so customers pay only for the days they keep it', () => {
  assert.equal(rentalCost(movie, 1), 300)
  assert.equal(rentalCost(movie, 3), 900)
})

test('a week or longer earns the 20% weekly rate, which is why 7 days costs less than 6', () => {
  assert.equal(rentalCost(movie, 6), 1800)
  assert.equal(rentalCost(movie, 7), 1680)
  assert.ok(rentalCost(movie, 7) < rentalCost(movie, 6))
})

test('the due date is the rental start plus the rented days', () => {
  assert.equal(dueAt(0, 3), 3 * DAY_MS)
})

test('a rental returned on the due date is not late, so no fee is charged', () => {
  const rental = { dueAt: 1000 * DAY_MS }
  assert.equal(lateDays(rental, 1000 * DAY_MS), 0)
  assert.equal(lateFeeCents(movie, rental, 1000 * DAY_MS), 0)
})

test('any part of a day past the due date counts as a full late day', () => {
  const rental = { dueAt: 0 }
  assert.equal(lateDays(rental, 1), 1)
  assert.equal(lateDays(rental, DAY_MS), 1)
  assert.equal(lateDays(rental, DAY_MS + 1), 2)
})

test('the late fee is 1.5x the daily rate per late day, so keeping it costs more than renting it', () => {
  const rental = { dueAt: 0 }
  assert.equal(lateFeeCents(movie, rental, 2 * DAY_MS), 900)
  assert.ok(lateFeeCents(movie, rental, DAY_MS) > movie.priceCents)
})

test('the amount owed is the original rental plus any late fee', () => {
  const rental = { dueAt: 0, costCents: 900 }
  assert.equal(totalDueCents(movie, rental, 0), 900)
  assert.equal(totalDueCents(movie, rental, DAY_MS), 1350)
})

test('stock drops per copy rented and cannot be rented past zero', () => {
  const rentals = [{ movieId: 'm' }, { movieId: 'm' }, { movieId: 'other' }]
  assert.equal(availableCopies(movie, []), 2)
  assert.equal(availableCopies(movie, rentals.slice(0, 1)), 1)
  assert.equal(availableCopies(movie, rentals), 0)
})

test('filters narrow the catalog by title, genre and stock so the shelf shows what can be rented', () => {
  const rentals = []
  const base = { query: '', genre: 'All', availableOnly: false }
  assert.equal(matchesFilters(movie, base, rentals), true)
  assert.equal(matchesFilters(movie, { ...base, query: 'hea' }, rentals), true)
  assert.equal(matchesFilters(movie, { ...base, query: 'dune' }, rentals), false)
  assert.equal(matchesFilters(movie, { ...base, genre: 'Drama' }, rentals), false)
  assert.equal(
    matchesFilters(movie, { ...base, availableOnly: true }, [{ movieId: 'm' }, { movieId: 'm' }]),
    false,
  )
})

test('money is shown in dollars and cents', () => {
  assert.equal(formatMoney(1680), '$16.80')
  assert.equal(formatMoney(0), '$0.00')
})

test('every catalog entry is priced and stocked so no card can render a broken rental', () => {
  for (const entry of MOVIES) {
    assert.ok(entry.priceCents > 0, `${entry.id} has no price`)
    assert.ok(entry.copies > 0, `${entry.id} has no copies`)
    assert.equal(findMovie(MOVIES, entry.id), entry)
  }
})
