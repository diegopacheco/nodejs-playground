import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { config } from '../config.js'

let state = null
let writes = Promise.resolve()

const load = async () => {
  if (state) return state
  try {
    const parsed = JSON.parse(await readFile(config.dataFile, 'utf8'))
    state = { workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [] }
  } catch {
    state = { workouts: [] }
  }
  return state
}

const persist = () => {
  const snapshot = JSON.stringify(state, null, 2)
  writes = writes.then(async () => {
    await mkdir(dirname(config.dataFile), { recursive: true })
    const temporary = `${config.dataFile}.${process.pid}.tmp`
    await writeFile(temporary, snapshot, 'utf8')
    await rename(temporary, config.dataFile)
  })
  return writes
}

export const readWorkouts = async (userId) =>
  (await load()).workouts.filter((workout) => workout.userId === userId)

export const insertWorkout = async (workout) => {
  const current = await load()
  current.workouts.push(workout)
  await persist()
  return workout
}

export const removeWorkout = async (userId, id) => {
  const current = await load()
  const index = current.workouts.findIndex((workout) => workout.id === id && workout.userId === userId)
  if (index < 0) return false
  current.workouts.splice(index, 1)
  await persist()
  return true
}
