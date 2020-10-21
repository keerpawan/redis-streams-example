const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

let cursor = '0'
const count = 1
const block = 0

app.get('/', (req, res) => {
  redisClient.xread('count', count, 'block', block, 'streams', 'some-stream', cursor, (err, incomingMessage) => {
    console.log('Consumer error: ', err)
    console.log('Consumer incoming message: ', incomingMessage)
    
    const message = JSON.parse(incomingMessage[0][1][0][1][1])
    console.log('Message:', message)
    cursor = incomingMessage[0][1][0][0]
    console.log('New cursor:', cursor)
    return res.send(`Received: ${JSON.stringify(message)}`)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Consumer listening on port ${PORT}`)
})
