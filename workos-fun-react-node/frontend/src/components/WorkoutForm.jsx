import { useState } from 'react'
import { emptyDraft, emptySet, toPayload, validateDraft } from '../gym/draft.js'

export const WorkoutForm = ({ exercises, onSave }) => {
  const [draft, setDraft] = useState(emptyDraft)
  const [issues, setIssues] = useState([])
  const [saving, setSaving] = useState(false)

  const updateSet = (key, field, value) => {
    setDraft((current) => ({
      ...current,
      sets: current.sets.map((set) => (set.key === key ? { ...set, [field]: value } : set))
    }))
  }

  const addSet = () => setDraft((current) => ({ ...current, sets: [...current.sets, emptySet()] }))

  const removeSet = (key) =>
    setDraft((current) => ({
      ...current,
      sets: current.sets.length === 1 ? current.sets : current.sets.filter((set) => set.key !== key)
    }))

  const submit = async (event) => {
    event.preventDefault()
    const found = validateDraft(draft)
    setIssues(found)
    if (found.length > 0) return

    setSaving(true)
    try {
      await onSave(toPayload(draft))
      setDraft(emptyDraft())
    } catch (error) {
      setIssues(error.issues?.length > 0 ? error.issues.map((issue) => `${issue.path} ${issue.message}`) : [error.message])
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Log a workout</h2>

      <div className="field-row">
        <label>
          Date
          <input
            type="date"
            value={draft.date}
            onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
          />
        </label>
        <label className="grow">
          Notes
          <input
            type="text"
            placeholder="felt strong"
            maxLength={500}
            value={draft.notes}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
          />
        </label>
      </div>

      <ul className="sets">
        {draft.sets.map((set, index) => (
          <li key={set.key}>
            <span className="set-index">{index + 1}</span>
            <select value={set.exerciseId} onChange={(event) => updateSet(set.key, 'exerciseId', event.target.value)}>
              <option value="">Exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="reps"
              value={set.reps}
              onChange={(event) => updateSet(set.key, 'reps', event.target.value)}
            />
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="kg"
              value={set.weightKg}
              onChange={(event) => updateSet(set.key, 'weightKg', event.target.value)}
            />
            <button type="button" className="ghost" onClick={() => removeSet(set.key)} disabled={draft.sets.length === 1}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {issues.length > 0 ? (
        <ul className="issues">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      ) : null}

      <div className="actions">
        <button type="button" className="ghost" onClick={addSet}>
          Add set
        </button>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? 'Saving' : 'Save workout'}
        </button>
      </div>
    </form>
  )
}
