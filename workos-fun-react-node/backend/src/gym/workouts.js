import { randomUUID } from 'node:crypto'
import { badRequest, notFound } from '../http/errors.js'
import { findExercise } from './exercises.js'
import { insertWorkout, readWorkouts, removeWorkout } from './store.js'
import { WorkoutDraft } from './types.js'

export const volumeOf = (sets) =>
  sets.reduce((total, set) => total + set.reps * set.weightKg, 0)

export const present = (workout) => ({
  id: workout.id,
  date: workout.date,
  notes: workout.notes,
  sets: workout.sets.map((set) => ({
    ...set,
    exerciseName: findExercise(set.exerciseId)?.name ?? set.exerciseId
  })),
  totalSets: workout.sets.length,
  totalVolumeKg: Math.round(volumeOf(workout.sets))
})

const byNewestFirst = (a, b) => Date.parse(b.date) - Date.parse(a.date)

export const buildWorkout = (userId, body) => {
  const draft = WorkoutDraft.parse(body)
  const unknown = draft.sets.find((set) => !findExercise(set.exerciseId))
  if (unknown) throw badRequest(`unknown exercise ${unknown.exerciseId}`)
  return {
    id: randomUUID(),
    userId,
    date: draft.date || new Date().toISOString(),
    notes: draft.notes,
    sets: draft.sets.map((set) => ({ id: randomUUID(), ...set }))
  }
}

export const createWorkout = async (userId, body) => present(await insertWorkout(buildWorkout(userId, body)))

export const listWorkouts = async (userId) => (await readWorkouts(userId)).sort(byNewestFirst).map(present)

export const deleteWorkout = async (userId, id) => {
  if (!(await removeWorkout(userId, id))) throw notFound(`no workout ${id}`)
}
