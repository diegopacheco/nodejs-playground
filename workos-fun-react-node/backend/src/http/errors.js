export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export const badRequest = (message) => new HttpError(400, message)

export const unauthorized = (message = 'not authenticated') => new HttpError(401, message)

export const forbidden = (message = 'forbidden') => new HttpError(403, message)

export const notFound = (message = 'not found') => new HttpError(404, message)

export const upstreamFailure = (message = 'upstream call failed') => new HttpError(502, message)
