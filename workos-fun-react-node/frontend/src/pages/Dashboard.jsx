import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useAuth } from '../auth/useAuth.js'
import { Header } from '../components/Header.jsx'
import { StatsPanel } from '../components/StatsPanel.jsx'
import { WorkoutForm } from '../components/WorkoutForm.jsx'
import { WorkoutList } from '../components/WorkoutList.jsx'

export const Dashboard = () => {
  const { signOut } = useAuth()
  const [exercises, setExercises] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const handle = useCallback(
    (failure) => {
      if (failure.status === 401) signOut()
      else setError(failure.message)
    },
    [signOut]
  )

  const refresh = useCallback(async () => {
    try {
      const [workoutsPayload, statsPayload] = await Promise.all([api.workouts(), api.stats()])
      setWorkouts(workoutsPayload.workouts)
      setStats(statsPayload.stats)
      setError('')
    } catch (failure) {
      handle(failure)
    }
  }, [handle])

  useEffect(() => {
    api
      .exercises()
      .then((payload) => setExercises(payload.exercises))
      .catch(handle)
    refresh()
  }, [handle, refresh])

  const save = async (payload) => {
    await api.createWorkout(payload)
    await refresh()
  }

  const remove = async (id) => {
    try {
      await api.deleteWorkout(id)
      await refresh()
    } catch (failure) {
      handle(failure)
    }
  }

  return (
    <div className="shell">
      <Header />
      {error ? <p className="notice">{error}</p> : null}
      <main className="grid">
        <div className="column">
          <WorkoutForm exercises={exercises} onSave={save} />
          <WorkoutList workouts={workouts} onDelete={remove} />
        </div>
        <div className="column">{stats ? <StatsPanel stats={stats} /> : null}</div>
      </main>
    </div>
  )
}
