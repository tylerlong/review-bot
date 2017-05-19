const { CronJob } = require('cron')

const client = require('../common/glip')
const engine = require('../common/nunjucks')
const { loadDb, saveDb } = require('./db')
const { getReviews } = require('./spider')
const { compareReviews, mergeReviews } = require('./util')

const RINGCENTRAL_APPS = {
  glip: 'com.glip.mobile',
  ringcentral: 'com.ringcentral.android',
  meetings: 'com.ringcentral.meetings'
}

const db = loadDb()

const monitors = {}
const notifyReview = (group, app, number, isNew) => {
  const entry = db[group][app].reviews[number - 1]
  const deviceMetadata = entry.comments[0].userComment.deviceMetadata
  const device = deviceMetadata ? `${deviceMetadata.manufacturer} ${deviceMetadata.productName}` : 'Unknown device'
  const review = {
    text: entry.comments[0].userComment.text.trim(),
    stars: entry.comments[0].userComment.starRating,
    device,
    author: entry.authorName === '' ? 'Unknown user' : entry.authorName
  }
  const message = engine.render('android/review.njk', { number, review, name: db[group][app].name, new: isNew })
  client.post(parseInt(group), message)
}
const cronJob = async (group, app) => {
  let reviews = await getReviews(app)
  const delta = compareReviews(db[group][app].reviews, reviews)
  db[group][app].reviews = mergeReviews(db[group][app].reviews, reviews)
  delta.forEach((number) => {
    notifyReview(group, app, number, true)
  })
  saveDb(db)
}
Object.keys(db).forEach((group) => {
  monitors[group] = {}
  Object.keys(db[group]).forEach((app) => {
    monitors[group][app] = new CronJob('0 */10 * * * *', () => {
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
  if (data.text === 'android list') {
    const apps = Object.keys(db[group]).map((app) => {
      return {
        name: db[group][app].name
      }
    })
    const message = engine.render('android/apps.njk', { apps })
    client.post(group, message)
    return
  }

  // android add
  let match = data.text.match(/^android add ([a-z0-9.]+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const reviews = await getReviews(app)
    db[group][app] = { name: app, reviews }

    monitors[group] = monitors[group] || {}
    if (monitors[group][app]) {
      monitors[group][app].stop()
      delete monitors[group][app]
    }
    monitors[group][app] = new CronJob('0 */10 * * * *', () => {
      cronJob(group, app)
    })
    monitors[group][app].start()

    client.post(group, 'done')
    saveDb(db)
    return
  }

  // android remove
  match = data.text.match(/^android remove ([a-z0-9.]+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    delete db[group][app]
    monitors[group][app].stop()
    delete monitors[group][app]
    client.post(group, 'done')
    saveDb(db)
    return
  }

  // android reviews
  match = data.text.match(/^android ([a-z0-9.]+) reviews$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const reviews = db[group][app].reviews.map((review) => {
      const deviceMetadata = review.comments[0].userComment.deviceMetadata
      const device = deviceMetadata ? `${deviceMetadata.manufacturer} ${deviceMetadata.productName}` : 'Unknown device'
      return {
        title: review.comments[0].userComment.text.trim().substring(0, 40) + '...',
        stars: review.comments[0].userComment.starRating,
        device,
        author: review.authorName === '' ? 'Unknown user' : review.authorName
      }
    })
    const message = engine.render('android/reviews.njk', { reviews, name: db[group][app].name })
    client.post(group, message)
    return
  }

  // android review
  match = data.text.match(/^android ([a-z0-9.]+) review (\d+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const number = parseInt(match[2])
    notifyReview(group, app, number, false)
  }
})
