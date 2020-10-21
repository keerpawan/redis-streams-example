const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

const createReader = require('@derhuerst/redis-stream/reader')
const reader = createReader(redisClient, 'some-stream')

const messages = []
reader.on('data', (data) => {
  console.log('Consumer received:', data)
  messages.push(data)
})

app.get('/', (req, res) => {
  return res.send(`Received: ${JSON.stringify(messages)}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Consumer listening on port ${PORT}`)
})
