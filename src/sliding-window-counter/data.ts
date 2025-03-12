type RequestLog = {
  counter: number
  lastRequestTimestamp: number
}

export const requestThreshold = 10
export const slidingWindowInMs = 60 * 1000
export const requestLogs = new Map<string, RequestLog>()
