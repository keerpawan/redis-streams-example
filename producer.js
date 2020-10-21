const express = require('express')
const redis = require('redis')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URL)

app.get('/', (req, res) => {
  const message = req.query
  redisClient.xadd('some-stream', '*', 'message', JSON.stringify(message), (error, cursor) => {
    console.log('Producer error:', error)
    console.log('Producer cursor:', cursor)
  }) 
  return res.send('Success')
})
 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
