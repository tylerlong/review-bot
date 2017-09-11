const { CronJob } = require('cron')

const client = require('../../common/glip')
const engine = require('../common/nunjucks')
const { loadDb, saveDb } = require('./db')
const { lookup } = require('./spider')

/*

ATT app:
- https://itunes.apple.com/us/app/ringcentral-office-hand-from-at-t/id398089358?mt=8
- ID = 398089358
http://itunes.apple.com/lookup?id=398089358

BT Cloud Phone
- https://itunes.apple.com/gb/app/bt-cloud-phone/id948639434?mt=8
- ID = 948639434
http://itunes.apple.com/gb/lookup?id=948639434

TELUS Business Connect
- https://itunes.apple.com/ca/app/telus-business-connect/id925058301?mt=8
- ID = 925058301
http://itunes.apple.com/lookup?id=925058301

*/

const db = loadDb()

const monitors = {}

const cronJob = async (group, app) => {
  let appInfo = await lookup(app)
  if (appInfo === null) { // invalid app
    return
  }
  const name = appInfo.trackName
  const version = appInfo.version
  if (db[group][app].version !== version) {
    client.post(group, `${name} ${version} has been released`)
    db[group][app] = { name, version }
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
    return
  }

  // ios add
  let match = data.text.match(/^release ios add (.+?)$/)
  if (match !== null) {
    const app = match[1].trim()
    const appInfo = await lookup(app)
    if (appInfo === null) { // invalid app
      client.post(group, `Invalid app ID: ${app}`)
      return
    }
    const name = appInfo.trackName
    const version = appInfo.version
    db[group][app] = { name, version }

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

  // ios remove
  match = data.text.match(/^release ios remove (.+?)$/)
  if (match !== null) {
    const app = match[1].trim()
    delete db[group][app]
    monitors[group][app].stop()
    delete monitors[group][app]
    client.post(group, 'done')
    saveDb(db)
    return
  }

  // ios release
  match = data.text.match(/^release ios ([a-z0-9]+)$/)
  if (match !== null) {
    const app = match[1].trim()
    const appInfo = db[group][app]
    if (appInfo) {
      client.post(group, `${appInfo.name} ${appInfo.version}`)
    } else {
      client.post(group, `We don't monitor this app: ${app}`)
    }
  }
})
