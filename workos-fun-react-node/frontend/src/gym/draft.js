export const emptySet = () => ({ key: crypto.randomUUID(), exerciseId: '', reps: '', weightKg: '' })

export const emptyDraft = () => ({ date: '', notes: '', sets: [emptySet()] })

const setIssues = (set, index) => {
  const issues = []
  if (!set.exerciseId) issues.push(`set ${index + 1}: pick an exercise`)
  if (!(Number(set.reps) >= 1)) issues.push(`set ${index + 1}: reps must be at least 1`)
  if (!(Number(set.weightKg) >= 0)) issues.push(`set ${index + 1}: weight must be zero or more`)
  return issues
}

export const validateDraft = (draft) => draft.sets.flatMap(setIssues)

export const toPayload = (draft) => ({
  date: draft.date ? new Date(draft.date).toISOString() : '',
  notes: draft.notes,
  sets: draft.sets.map((set) => ({
    exerciseId: set.exerciseId,
    reps: Number(set.reps),
    weightKg: Number(set.weightKg)
  }))
})
