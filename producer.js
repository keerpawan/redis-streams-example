const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

const createWriter = require('@derhuerst/redis-stream/writer')
const writer = createWriter(redisClient, 'some-stream')

app.get('/', (req, res) => {
  const message = req.query
  return writer.write(message, () => {
    console.log('Producer sent:', message)
    return res.send('Success')
  })
})
 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
