const formatVolume = (kg) => `${kg.toLocaleString()} kg`

export const StatsPanel = ({ stats }) => {
  const peak = stats.volumeByMuscleGroup[0]?.volumeKg ?? 0

  return (
    <section className="panel">
      <h2>Progress</h2>
      <div className="tiles">
        <div className="tile">
          <span>{stats.workouts}</span>
          <small>workouts</small>
        </div>
        <div className="tile">
          <span>{stats.totalSets}</span>
          <small>sets</small>
        </div>
        <div className="tile">
          <span>{formatVolume(stats.totalVolumeKg)}</span>
          <small>total volume</small>
        </div>
      </div>

      <h3>Volume by muscle group</h3>
      {stats.volumeByMuscleGroup.length === 0 ? (
        <p className="empty">Log a workout to see your split.</p>
      ) : (
        <ul className="bars">
          {stats.volumeByMuscleGroup.map((entry) => (
            <li key={entry.muscleGroup}>
              <span className="bar-label">{entry.muscleGroup}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${peak ? (entry.volumeKg / peak) * 100 : 0}%` }} />
              </span>
              <span className="bar-value">{formatVolume(entry.volumeKg)}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>Personal records</h3>
      {stats.personalRecords.length === 0 ? (
        <p className="empty">No records yet.</p>
      ) : (
        <ul className="records">
          {stats.personalRecords.map((record) => (
            <li key={record.exerciseId}>
              <span>{record.exerciseName}</span>
              <strong>
                {record.weightKg} kg x {record.reps}
              </strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
