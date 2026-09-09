import { findExercise } from './exercises.js'

export const buildStats = (workouts) => {
  const volumeByGroup = new Map()
  const records = new Map()
  let totalVolumeKg = 0
  let totalSets = 0

  for (const workout of workouts) {
    for (const set of workout.sets) {
      const exercise = findExercise(set.exerciseId)
      if (!exercise) continue
      const volume = set.reps * set.weightKg
      totalVolumeKg += volume
      totalSets += 1
      volumeByGroup.set(exercise.muscleGroup, (volumeByGroup.get(exercise.muscleGroup) ?? 0) + volume)
      const best = records.get(exercise.id)
      if (!best || set.weightKg > best.weightKg) {
        records.set(exercise.id, {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          weightKg: set.weightKg,
          reps: set.reps,
          date: workout.date
        })
      }
    }
  }

  return {
    workouts: workouts.length,
    totalSets,
    totalVolumeKg: Math.round(totalVolumeKg),
    volumeByMuscleGroup: [...volumeByGroup.entries()]
      .map(([muscleGroup, volumeKg]) => ({ muscleGroup, volumeKg: Math.round(volumeKg) }))
      .sort((a, b) => b.volumeKg - a.volumeKg),
    personalRecords: [...records.values()].sort((a, b) => b.weightKg - a.weightKg)
  }
}
