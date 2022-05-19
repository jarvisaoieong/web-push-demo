const express = require('express')
const webpush = require('web-push')
const fs = require('fs')

// Generate Key
let key
try {
  key = require('./VAPIDKeys.json')
} catch (error) {
  key = webpush.generateVAPIDKeys()
  fs.writeFileSync(__dirname + '/VAPIDKeys.json', JSON.stringify(key, null, 2))
  fs.writeFileSync(
    __dirname + '/publicVapidKey.js',
    `window.publicVapidKey = '${key.publicKey}';`
  )
}

// Replace with your email
webpush.setVapidDetails(
  'mailto:kinua1230@gmail.com',
  key.publicKey,
  key.privateKey
)

const app = express()

app.use(require('body-parser').json())

app.post('/subscribe', async (req, res) => {
  const subscription = req.body
  console.log(subscription)
  res.status(201).json({})

  const payload = JSON.stringify({ title: 'test' })
  await webpush.sendNotification(subscription, payload)
  console.log('pushing')
})

app.use(require('express-static')('./'))

app.listen(3000)
