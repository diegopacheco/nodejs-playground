import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { createRouter } from './router.js'

const routerWith = () => {
  const router = createRouter()
  router.get('/api/workouts', () => 'list')
  router.post('/api/workouts', () => 'create')
  router.delete('/api/workouts/:id', () => 'delete')
  return router
}

test('the same path on a different method never falls through to the wrong handler', () => {
  strictEqual(routerWith().match('GET', '/api/workouts').handler(), 'list')
  strictEqual(routerWith().match('POST', '/api/workouts').handler(), 'create')
})

test('path params are decoded so ids with escapes reach the handler intact', () => {
  deepStrictEqual(routerWith().match('DELETE', '/api/workouts/a%2Fb').params, { id: 'a/b' })
})

test('an unknown path matches nothing so the server can answer 404 instead of guessing', () => {
  strictEqual(routerWith().match('GET', '/api/unknown'), null)
  strictEqual(routerWith().match('GET', '/api/workouts/1/extra'), null)
})
