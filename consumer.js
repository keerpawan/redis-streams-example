const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

const createReader = require('./redis-stream/reader')
// by setting this to true you can get all the events the app missed while it was not running
const BEGUNING = false
// you can also specify an actual curor id to start reading the stream from if you have that available to you
const cursor = BEGUNING ? '0' : '$'
const reader = createReader(redisClient, 'some-stream', { cursor })

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
