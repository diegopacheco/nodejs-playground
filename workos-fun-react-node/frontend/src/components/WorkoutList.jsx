const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

export const WorkoutList = ({ workouts, onDelete }) => {
  if (workouts.length === 0) {
    return (
      <section className="panel">
        <h2>History</h2>
        <p className="empty">Nothing logged yet. Your first workout shows up here.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>History</h2>
      <ul className="workouts">
        {workouts.map((workout) => (
          <li key={workout.id}>
            <div className="workout-head">
              <div>
                <strong>{formatDate(workout.date)}</strong>
                <small>
                  {workout.totalSets} sets, {workout.totalVolumeKg.toLocaleString()} kg
                </small>
              </div>
              <button type="button" className="ghost" onClick={() => onDelete(workout.id)}>
                Delete
              </button>
            </div>
            {workout.notes ? <p className="workout-notes">{workout.notes}</p> : null}
            <ul className="workout-sets">
              {workout.sets.map((set) => (
                <li key={set.id}>
                  <span>{set.exerciseName}</span>
                  <em>
                    {set.reps} x {set.weightKg} kg
                  </em>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
