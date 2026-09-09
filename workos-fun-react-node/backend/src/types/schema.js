export class ValidationError extends Error {
  constructor(type, issues) {
    super(`${type} is invalid`)
    this.name = 'ValidationError'
    this.type = type
    this.issues = issues
  }
}

const ok = (value) => ({ value })

const bad = (path, message) => ({ issues: [{ path, message }] })

export const str = ({ min = 1, max = 200 } = {}) => (raw, path) => {
  if (typeof raw !== 'string') return bad(path, 'must be a string')
  const value = raw.trim()
  if (value.length < min) return bad(path, `must have at least ${min} characters`)
  if (value.length > max) return bad(path, `must have at most ${max} characters`)
  return ok(value)
}

export const num = ({ min = -Infinity, max = Infinity } = {}) => (raw, path) => {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw
  if (typeof value !== 'number' || !Number.isFinite(value)) return bad(path, 'must be a number')
  if (value < min) return bad(path, `must be at least ${min}`)
  if (value > max) return bad(path, `must be at most ${max}`)
  return ok(value)
}

export const int = (options) => (raw, path) => {
  const result = num(options)(raw, path)
  if (result.issues) return result
  if (!Number.isInteger(result.value)) return bad(path, 'must be a whole number')
  return result
}

export const enumOf = (allowed) => (raw, path) =>
  allowed.includes(raw) ? ok(raw) : bad(path, `must be one of ${allowed.join(', ')}`)

export const isoDate = () => (raw, path) => {
  if (typeof raw !== 'string' || Number.isNaN(Date.parse(raw))) return bad(path, 'must be an ISO date')
  return ok(new Date(raw).toISOString())
}

export const list = (item, { min = 0, max = 100 } = {}) => (raw, path) => {
  if (!Array.isArray(raw)) return bad(path, 'must be an array')
  if (raw.length < min) return bad(path, `must have at least ${min} items`)
  if (raw.length > max) return bad(path, `must have at most ${max} items`)
  const issues = []
  const value = []
  raw.forEach((entry, index) => {
    const result = item(entry, `${path}[${index}]`)
    if (result.issues) issues.push(...result.issues)
    else value.push(result.value)
  })
  return issues.length > 0 ? { issues } : ok(value)
}

export const optional = (item, fallback) => (raw, path) =>
  raw === undefined || raw === null || raw === '' ? ok(fallback) : item(raw, path)

export const nested = (type) => (raw, path) => type.check(raw, path)

export const defineType = (name, fields) => {
  const keys = Object.keys(fields)
  const check = (raw, path = name) => {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
      return bad(path, 'must be an object')
    }
    const issues = []
    const value = {}
    for (const key of keys) {
      const result = fields[key](raw[key], `${path}.${key}`)
      if (result.issues) issues.push(...result.issues)
      else value[key] = result.value
    }
    return issues.length > 0 ? { issues } : ok(value)
  }
  const parse = (raw) => {
    const result = check(raw)
    if (result.issues) throw new ValidationError(name, result.issues)
    return result.value
  }
  return { name, check, parse }
}
