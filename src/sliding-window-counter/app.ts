import express from 'express'
import { rateLimitMiddleware } from './middleware'

export const slidingWindowCounterApp = express()
const port = 3000

slidingWindowCounterApp.get('/unlimited', (req, res) => {
  res.send('We are unlimited!')
})

slidingWindowCounterApp.get('/limited', rateLimitMiddleware, (req, res) => {
  res.send('We are limited!')
})

slidingWindowCounterApp.listen(port, () => {
  console.log(`Sliding window counter app listening at http://localhost:${port}`)
})