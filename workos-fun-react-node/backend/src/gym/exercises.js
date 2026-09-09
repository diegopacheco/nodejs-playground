import { Exercise } from './types.js'

const CATALOG = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'chest' },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'chest' },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back' },
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'back' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back' },
  { id: 'back-squat', name: 'Back Squat', muscleGroup: 'legs' },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'legs' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs' },
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders' },
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'arms' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'arms' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'arms' },
  { id: 'plank', name: 'Plank', muscleGroup: 'core' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'core' },
  { id: 'rowing-machine', name: 'Rowing Machine', muscleGroup: 'cardio' },
  { id: 'treadmill-run', name: 'Treadmill Run', muscleGroup: 'cardio' }
].map((entry) => Exercise.parse(entry))

const BY_ID = new Map(CATALOG.map((exercise) => [exercise.id, exercise]))

export const listExercises = () => CATALOG

export const findExercise = (id) => BY_ID.get(id) ?? null
