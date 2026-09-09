import { protect } from '../auth/guard.js'
import { readJson } from '../http/request.js'
import { sendJson } from '../http/response.js'
import { listExercises } from './exercises.js'
import { buildStats } from './stats.js'
import { readWorkouts } from './store.js'
import { createWorkout, deleteWorkout, listWorkouts } from './workouts.js'

export const registerGymRoutes = (router) => {
  router.get('/api/health', ({ res }) => sendJson(res, 200, { status: 'up' }))

  router.get('/api/exercises', protect(({ res }) => sendJson(res, 200, { exercises: listExercises() })))

  router.get('/api/workouts', protect(async ({ res, user }) =>
    sendJson(res, 200, { workouts: await listWorkouts(user.id) })
  ))

  router.post('/api/workouts', protect(async ({ req, res, user }) =>
    sendJson(res, 201, { workout: await createWorkout(user.id, await readJson(req)) })
  ))

  router.delete('/api/workouts/:id', protect(async ({ res, params, user }) => {
    await deleteWorkout(user.id, params.id)
    sendJson(res, 200, { deleted: params.id })
  }))

  router.get('/api/stats', protect(async ({ res, user }) =>
    sendJson(res, 200, { stats: buildStats(await readWorkouts(user.id)) })
  ))
}
