import { defineType, enumOf, int, isoDate, list, nested, num, optional, str } from '../types/schema.js'

export const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio']

export const Exercise = defineType('Exercise', {
  id: str({ max: 60 }),
  name: str({ max: 80 }),
  muscleGroup: enumOf(MUSCLE_GROUPS)
})

export const SetEntry = defineType('SetEntry', {
  exerciseId: str({ max: 60 }),
  reps: int({ min: 1, max: 500 }),
  weightKg: num({ min: 0, max: 1000 })
})

export const WorkoutDraft = defineType('Workout', {
  date: optional(isoDate(), ''),
  notes: optional(str({ min: 0, max: 500 }), ''),
  sets: list(nested(SetEntry), { min: 1, max: 60 })
})
