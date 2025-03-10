import express from 'express'
import { rateLimitMiddleware } from './middleware'

export const fixedWindowCounterApp = express()
const port = 3000

fixedWindowCounterApp.get('/unlimited', (req, res) => {
  res.send('We are unlimited!')
})

fixedWindowCounterApp.get('/limited', rateLimitMiddleware, (req, res) => {
  res.send('We are limited!')
})

fixedWindowCounterApp.listen(port, () => {
  console.log(`Fixed window counter app listening at http://localhost:${port}`)
})