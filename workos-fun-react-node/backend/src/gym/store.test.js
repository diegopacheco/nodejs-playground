import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

const directory = await mkdtemp(join(tmpdir(), 'gym-store-'))
process.env.DATA_FILE = join(directory, 'gym.json')

const { insertWorkout, readWorkouts, removeWorkout } = await import('./store.js')

const workout = (id, userId) => ({ id, userId, date: '2026-01-01T00:00:00.000Z', notes: '', sets: [] })

after(() => rm(directory, { recursive: true, force: true }))

test('a read only ever returns the workouts of the account that asked', async () => {
  await insertWorkout(workout('w1', 'user_a'))
  await insertWorkout(workout('w2', 'user_b'))
  deepStrictEqual((await readWorkouts('user_a')).map((entry) => entry.id), ['w1'])
  deepStrictEqual((await readWorkouts('user_b')).map((entry) => entry.id), ['w2'])
})

test('one account cannot delete another account workout', async () => {
  strictEqual(await removeWorkout('user_b', 'w1'), false)
  deepStrictEqual((await readWorkouts('user_a')).map((entry) => entry.id), ['w1'])
})

test('deleting an owned workout removes it', async () => {
  strictEqual(await removeWorkout('user_a', 'w1'), true)
  deepStrictEqual(await readWorkouts('user_a'), [])
})

test('a workout survives a fresh load of the data file', async () => {
  const reloaded = await import(`./store.js?reload=${Date.now()}`)
  deepStrictEqual((await reloaded.readWorkouts('user_b')).map((entry) => entry.id), ['w2'])
})
