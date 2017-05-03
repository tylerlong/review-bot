const GlipSocket = require('glip.socket.io')

const client = new GlipSocket({
  host: process.env.GLIP_HOST,
  port: process.env.GLIP_PORT,
  user: process.env.GLIP_EMAIL,
  password: process.env.GLIP_PASSWORD
})

client.start()

module.exports = client
