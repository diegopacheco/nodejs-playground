import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { ValidationError, defineType, enumOf, int, list, nested, num, optional, str } from './schema.js'

const Point = defineType('Point', { name: str({ max: 5 }), x: int({ min: 0 }), y: num({ min: 0, max: 10 }) })

test('parse returns a clean object so callers never handle raw input', () => {
  deepStrictEqual(Point.parse({ name: '  ab  ', x: 3, y: '4.5', extra: 'dropped' }), { name: 'ab', x: 3, y: 4.5 })
})

test('every violated field is reported so a form can show all errors at once', () => {
  try {
    Point.parse({ name: 'toolong', x: 1.5, y: 99 })
    throw new Error('parse should have rejected the input')
  } catch (error) {
    strictEqual(error instanceof ValidationError, true)
    deepStrictEqual(error.issues.map((issue) => issue.path), ['Point.name', 'Point.x', 'Point.y'])
  }
})

test('a missing field is a violation, not an undefined that leaks downstream', () => {
  throws(() => Point.parse({ x: 1, y: 1 }), ValidationError)
})

test('a non object is rejected before any field is touched', () => {
  throws(() => Point.parse(null), ValidationError)
  throws(() => Point.parse([]), ValidationError)
})

test('optional falls back instead of storing an empty string', () => {
  const Note = defineType('Note', { text: optional(str(), 'none') })
  strictEqual(Note.parse({}).text, 'none')
  strictEqual(Note.parse({ text: '' }).text, 'none')
})

test('enumOf keeps unknown values out of persisted data', () => {
  const Tag = defineType('Tag', { kind: enumOf(['a', 'b']) })
  strictEqual(Tag.parse({ kind: 'b' }).kind, 'b')
  throws(() => Tag.parse({ kind: 'c' }), ValidationError)
})

test('list validates each item and reports the offending index', () => {
  const Bag = defineType('Bag', { items: list(nested(Point), { min: 1 }) })
  try {
    Bag.parse({ items: [{ name: 'a', x: 1, y: 1 }, { name: 'b', x: -1, y: 1 }] })
    throw new Error('parse should have rejected the input')
  } catch (error) {
    deepStrictEqual(error.issues.map((issue) => issue.path), ['Bag.items[1].x'])
  }
})

test('an empty required list is rejected so a workout cannot be logged with no sets', () => {
  const Bag = defineType('Bag', { items: list(nested(Point), { min: 1 }) })
  throws(() => Bag.parse({ items: [] }), ValidationError)
})
