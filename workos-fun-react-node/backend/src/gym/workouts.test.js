import { ok, strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { ValidationError } from '../types/schema.js'
import { buildWorkout, present } from './workouts.js'

const validDraft = { sets: [{ exerciseId: 'bench-press', reps: 8, weightKg: 60 }] }

test('a workout is owned by the caller so it can never be read by another account', () => {
  strictEqual(buildWorkout('user_a', validDraft).userId, 'user_a')
})

test('a set for an exercise outside the catalog is rejected so stats stay computable', () => {
  throws(() => buildWorkout('user_a', { sets: [{ exerciseId: 'ghost', reps: 8, weightKg: 60 }] }), /unknown exercise ghost/)
})

test('zero reps is rejected because a set with no reps is not a set', () => {
  throws(() => buildWorkout('user_a', { sets: [{ exerciseId: 'bench-press', reps: 0, weightKg: 60 }] }), ValidationError)
})

test('a negative weight is rejected so volume can never be reduced by bad input', () => {
  throws(() => buildWorkout('user_a', { sets: [{ exerciseId: 'bench-press', reps: 8, weightKg: -10 }] }), ValidationError)
})

test('a workout with no sets is rejected so empty entries never reach the log', () => {
  throws(() => buildWorkout('user_a', { sets: [] }), ValidationError)
})

test('an omitted date defaults to now so the log is always ordered', () => {
  ok(Date.parse(buildWorkout('user_a', validDraft).date) > 0)
})

test('the response shape never carries userId back to the browser', () => {
  const response = present(buildWorkout('user_a', validDraft))
  strictEqual('userId' in response, false)
  strictEqual(response.totalVolumeKg, 480)
  strictEqual(response.sets[0].exerciseName, 'Bench Press')
})
