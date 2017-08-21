const client = require('../../common/glip')
const engine = require('../common/nunjucks')
const { loadDb, saveDb } = require('./db')

const RINGCENTRAL_APPS = {
  glip: 715886894,
  ringcentral: 293305984,
  meetings: 688920955
}

const db = loadDb()

client.on('message', async (type, data) => {
  if (type !== client.type_ids.TYPE_ID_POST) {
    return
  }

  const group = data.group_id
  db[group] = db[group] || {}

  // ios list
  if (data.text === 'release ios list') {
    const apps = Object.keys(db[group]).map((app) => {
      return {
        id: app,
        name: db[group][app].name
      }
    })
    const message = engine.render('ios/apps.njk', { apps })
    client.post(group, message)
  }
})
