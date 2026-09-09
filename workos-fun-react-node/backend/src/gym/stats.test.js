import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { buildStats } from './stats.js'

const workout = (date, sets) => ({ id: date, userId: 'u', date, notes: '', sets })

test('volume is reps times weight so heavier low rep work is not undercounted', () => {
  const stats = buildStats([workout('2026-01-01T00:00:00.000Z', [{ exerciseId: 'back-squat', reps: 5, weightKg: 100 }])])
  strictEqual(stats.totalVolumeKg, 500)
  strictEqual(stats.totalSets, 1)
  strictEqual(stats.workouts, 1)
})

test('volume is grouped by muscle group so a training imbalance is visible', () => {
  const stats = buildStats([
    workout('2026-01-01T00:00:00.000Z', [
      { exerciseId: 'back-squat', reps: 5, weightKg: 100 },
      { exerciseId: 'bench-press', reps: 5, weightKg: 60 }
    ])
  ])
  deepStrictEqual(stats.volumeByMuscleGroup, [
    { muscleGroup: 'legs', volumeKg: 500 },
    { muscleGroup: 'chest', volumeKg: 300 }
  ])
})

test('a personal record is the heaviest set ever, not the most recent one', () => {
  const stats = buildStats([
    workout('2026-01-01T00:00:00.000Z', [{ exerciseId: 'deadlift', reps: 1, weightKg: 180 }]),
    workout('2026-02-01T00:00:00.000Z', [{ exerciseId: 'deadlift', reps: 8, weightKg: 120 }])
  ])
  deepStrictEqual(stats.personalRecords, [
    { exerciseId: 'deadlift', exerciseName: 'Deadlift', weightKg: 180, reps: 1, date: '2026-01-01T00:00:00.000Z' }
  ])
})

test('a set referencing an unknown exercise is ignored instead of corrupting totals', () => {
  const stats = buildStats([workout('2026-01-01T00:00:00.000Z', [{ exerciseId: 'ghost', reps: 5, weightKg: 100 }])])
  strictEqual(stats.totalVolumeKg, 0)
  strictEqual(stats.totalSets, 0)
})

test('no workouts produces zeroes rather than NaN in the dashboard', () => {
  deepStrictEqual(buildStats([]), {
    workouts: 0,
    totalSets: 0,
    totalVolumeKg: 0,
    volumeByMuscleGroup: [],
    personalRecords: []
  })
})
