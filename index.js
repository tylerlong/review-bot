require('dotenv').config()
const GlipSocket = require('glip.socket.io')
const { engine } = require('./nunjucks')

const RINGCENTRAL_APPS = {
  glip: 715886894,
  ringcentral: 293305984,
  meetings: 688920955
}

const db = {}

const client = new GlipSocket({
  host: process.env.GLIP_HOST,
  port: process.env.GLIP_PORT,
  user: process.env.GLIP_EMAIL,
  password: process.env.GLIP_PASSWORD
})

client.on('message', (type, data) => {
  if (type === client.type_ids.TYPE_ID_POST) {
    const group = data.group_id
    db[group] = db[group] || {}
    if (data.text === 'app list') {
      const apps = Object.keys(db[group]).map((app) => {
        return {
          id: app,
          name: db[group][app].name
        }
      })
      const message = engine.render('apps.njk', { apps })
      client.post(group, message)
      return
    }
    if (data.text === 'app add') {
      client.post(group, 'app added')
    }
  }
})

client.start()
