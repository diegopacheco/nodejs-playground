const split = (path) => path.split('/').filter(Boolean)

export const createRouter = () => {
  const routes = []

  const add = (method, pattern, handler) => {
    routes.push({ method, segments: split(pattern), handler })
  }

  const match = (method, pathname) => {
    const parts = split(pathname)
    for (const route of routes) {
      if (route.method !== method || route.segments.length !== parts.length) continue
      const params = {}
      let matched = true
      for (let index = 0; index < parts.length; index += 1) {
        const segment = route.segments[index]
        if (segment.startsWith(':')) params[segment.slice(1)] = decodeURIComponent(parts[index])
        else if (segment !== parts[index]) {
          matched = false
          break
        }
      }
      if (matched) return { handler: route.handler, params }
    }
    return null
  }

  return {
    get: (pattern, handler) => add('GET', pattern, handler),
    post: (pattern, handler) => add('POST', pattern, handler),
    delete: (pattern, handler) => add('DELETE', pattern, handler),
    match
  }
}
