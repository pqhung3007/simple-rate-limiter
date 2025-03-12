import type { Request, Response, NextFunction } from 'express'
import { requestLogs, requestThreshold, slidingWindowInMs } from './data'

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip
  if (!ip) {
    res.status(500).send('No IP address found on request')
    return
  }

  // first request from this IP
  if (!requestLogs.has(ip)) {
    requestLogs.set(ip, { counter: 1, lastRequestTimestamp: Date.now() })
    next()
    return
  }

  const currentTime = Date.now()
  const log = requestLogs.get(ip)

  if (log) {
    const timeElapsed = currentTime - log.lastRequestTimestamp

    // calculate how many requests should be removed from the counter
    const timePerRequest = slidingWindowInMs / requestThreshold
    const requestsToBeRemoved = Math.floor(timeElapsed / timePerRequest)

    // reduce counter based on elapsed time (but not below 0)
    log.counter = Math.max(0, log.counter - requestsToBeRemoved)

    // update timestamp to current request time
    log.lastRequestTimestamp = currentTime

    const shouldBlockRequest = log.counter >= requestThreshold
    if (shouldBlockRequest) {
      res.status(429).send('Too many requests')
      return
    }

    log.counter++
    next()
  }
}