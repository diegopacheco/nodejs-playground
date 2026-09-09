import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { parseEnvFile, readerFor } from './env.js'

const write = (contents) => {
  const path = join(mkdtempSync(join(tmpdir(), 'gym-env-')), 'values')
  writeFileSync(path, contents, 'utf8')
  return path
}

test('a missing file parses to nothing instead of throwing at import time', () => {
  deepStrictEqual(parseEnvFile('/nope/does/not/exist'), {})
})

test('comments and blank lines are ignored so a documented file still parses', () => {
  deepStrictEqual(parseEnvFile(write('# a note\n\nWORKOS_CLIENT_ID=client_abc\n')), {
    WORKOS_CLIENT_ID: 'client_abc'
  })
})

test('quotes are stripped so a pasted quoted value is not sent to WorkOS verbatim', () => {
  deepStrictEqual(parseEnvFile(write('A="one"\nB=\'two\'\nC=three\n')), { A: 'one', B: 'two', C: 'three' })
})

test('a value containing = keeps everything after the first separator', () => {
  strictEqual(parseEnvFile(write('KEY=sk_test_aa=bb=cc\n')).KEY, 'sk_test_aa=bb=cc')
})

test('the file wins over an exported shell variable, so the file is the source of truth', () => {
  process.env.GYM_PRECEDENCE = 'from-shell'
  strictEqual(readerFor({ GYM_PRECEDENCE: 'from-file' })('GYM_PRECEDENCE'), 'from-file')
})

test('an exported variable is still used when the file does not set the key', () => {
  process.env.GYM_ONLY_SHELL = 'from-shell'
  strictEqual(readerFor({})('GYM_ONLY_SHELL'), 'from-shell')
})

test('the fallback applies only when neither the file nor the shell has the key', () => {
  strictEqual(readerFor({})('GYM_NOWHERE', 'fallback'), 'fallback')
})
