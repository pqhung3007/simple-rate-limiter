import type { Request, Response, NextFunction } from 'express'
import { counters, rateLimitWindowInMs, requestLimitPerWindow } from './data'

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip
  if (!ip) {
    res.status(500).send('No IP address found on request')
    return
  }

  const currentTime = Date.now()
  if (!counters.has(ip)) {
    counters.set(ip, { count: 1, startTime: currentTime })
    next()
    return
  }

  const windowCounter = counters.get(ip)
  if (windowCounter) {
    const difference = currentTime - windowCounter.startTime
    const isGreaterThanWindow = difference > rateLimitWindowInMs

    if (isGreaterThanWindow) {
      // reset the counter for the new window
      windowCounter.count = 1
      windowCounter.startTime = currentTime
      next()
    } else if (windowCounter.count < requestLimitPerWindow) {
      // increment the counter and allow the request
      windowCounter.count++
      next()
    } else {
      res.status(429).send('Too many requests')
    }
  }
}