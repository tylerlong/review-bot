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

    // app list
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

    // app add
    const match = data.text.match(/^app add ([a-z0-9]+)$/)
    if (match !== null) {
      const app = RINGCENTRAL_APPS[match[1]] || match[1]
      db[group][app] = {}

      client.post(group, app)
      return
    }

    if (1 === 1) {

    }
  }
})

client.start()
