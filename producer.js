const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

const createWriter = require('./redis-stream/writer')
const writer = createWriter(redisClient, 'some-stream')

app.get('/', (req, res) => {
  const message = req.query
  console.log('mes', message)
  if (!message || Object.keys(message).length === 0) {
    return res.status(400).send('Pass query params to send the message. Eg: ?some=message')
  }
  return writer.write(message, () => {
    console.log('Producer sent:', message)
    return res.send('Success')
  })
})
 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
