require('dotenv').config()
const GlipSocket = require('glip.socket.io')

const client = new GlipSocket({
  host: process.env.GLIP_HOST,
  port: process.env.GLIP_PORT,
  user: process.env.GLIP_EMAIL,
  password: process.env.GLIP_PASSWORD
})

client.on('message', (type, data) => {
  if (type === client.type_ids.TYPE_ID_POST && data.text === 'ping') {
    client.post(data.group_id, 'pong')
  }
})

client.start()
