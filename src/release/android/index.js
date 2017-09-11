const { CronJob } = require('cron')

const client = require('../../common/glip')
const engine = require('../common/nunjucks')
const { loadDb, saveDb } = require('./db')
const { lookup } = require('./spider')

/*
- ATT:
https://play.google.com/store/apps/details?id=com.attofficeathand.android&hl=en_US

- BT:
https://play.google.com/store/apps/details?id=com.bt.cloudphone&hl=en_US

- TELUS:
https://play.google.com/store/apps/details?id=com.telusvoip.android&hl=en_US
*/

const db = loadDb()

const monitors = {}
const cronJob = async (group, app) => {
  let appInfo = await lookup(app)
  if (appInfo === null) { // invalid app
    return
  }
  const name = appInfo.name
  const version = appInfo.version
  const releaseDate = appInfo.releaseDate
  if (db[group][app].version !== version) {
    client.post(group, `**Android** app ${name} **${version}** was released at ${releaseDate}`)
    db[group][app] = { name, version, releaseDate }
  }
  saveDb(db)
}
Object.keys(db).forEach((group) => {
  monitors[group] = {}
  Object.keys(db[group]).forEach((app) => {
    monitors[group][app] = new CronJob('0 */30 * * * *', () => {
      cronJob(group, app)
    })
    monitors[group][app].start()
  })
})

client.on('message', async (type, data) => {
  if (type !== client.type_ids.TYPE_ID_POST) {
    return
  }

  const group = data.group_id
  db[group] = db[group] || {}

  // android list
  if (data.text.match(/^release android list$/i)) {
    const apps = Object.keys(db[group]).map(app => {
      return {
        id: app,
        name: db[group][app].name
      }
    })
    const message = engine.render('android/apps.njk', { apps })
    client.post(group, message)
    return
  }

  // android add
  let match = data.text.match(/^release android add (.+?)$/i)
  if (match !== null) {
    const app = match[1].trim()
    const appInfo = await lookup(app)
    if (appInfo === null) { // invalid app
      client.post(group, `Invalid app ID: ${app}`)
      return
    }
    const name = appInfo.name
    const version = appInfo.version
    const releaseDate = appInfo.releaseDate
    db[group][app] = { name, version, releaseDate }

    monitors[group] = monitors[group] || {}
    if (monitors[group][app]) {
      monitors[group][app].stop()
      delete monitors[group][app]
    }
    monitors[group][app] = new CronJob('0 */30 * * * *', () => {
      cronJob(group, app)
    })
    monitors[group][app].start()

    client.post(group, 'done')
    saveDb(db)
    return
  }

  // android remove
  match = data.text.match(/^release android remove (.+?)$/i)
  if (match !== null) {
    const app = match[1].trim()
    delete db[group][app]
    monitors[group][app].stop()
    delete monitors[group][app]
    client.post(group, 'done')
    saveDb(db)
    return
  }

  // android release
  match = data.text.match(/^release android (.+?)$/i)
  if (match !== null) {
    const app = match[1].trim()
    const appInfo = db[group][app]
    if (appInfo) {
      client.post(group, `**Android** app ${appInfo.name} **${appInfo.version}** was released at ${appInfo.releaseDate}`)
    } else {
      client.post(group, `We don't monitor this app: ${app}`)
    }
  }
})
