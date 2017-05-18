const client = require('../common/glip')
const { loadDb, saveDb } = require('./db')
const { getReviews } = require('./spider')

const RINGCENTRAL_APPS = {
  glip: 'com.glip.mobile',
  ringcentral: 'com.ringcentral.android',
  meetings: 'com.ringcentral.meetings'
}

const db = loadDb()

client.on('message', async (type, data) => {
  if (type !== client.type_ids.TYPE_ID_POST) {
    return
  }

  const group = data.group_id
  db[group] = db[group] || {}

  // android list
  if (data.text === 'android list') {
    const reviews1 = await getReviews('com.ringcentral.android')
    console.log(JSON.stringify(reviews1))
    console.log('==============')
    const reviews2 = await getReviews('com.ringcentral.meetings')
    console.log(JSON.stringify(reviews2))
    return
  }

  // android add
  let match = data.text.match(/^android add ([a-z0-9]+)$/)
  if (match !== null) {
    saveDb(db)
    return
  }

  // android remove
  match = data.text.match(/^android remove ([a-z0-9]+)$/)
  if (match !== null) {
    saveDb(db)
    return
  }

  // android reviews
  match = data.text.match(/^android ([a-z0-9]+) reviews$/)
  if (match !== null) {
    return
  }

  // android review
  match = data.text.match(/^android ([a-z0-9]+) review (\d+)$/)
  if (match !== null) {
  }
})
