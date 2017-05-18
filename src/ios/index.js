require('dotenv').config()
const { CronJob } = require('cron')

const client = require('../common/glip')
const engine = require('./nunjucks')
const { getReviews } = require('./spider')
const { compareReviews, mergeReviews } = require('./util')
const { loadDb, saveDb } = require('./db')

const RINGCENTRAL_APPS = {
  glip: 715886894,
  ringcentral: 293305984,
  meetings: 688920955
}

const db = loadDb()

const monitors = {}
const notifyReview = (group, app, number, isNew) => {
  const entry = db[group][app].reviews[number - 1]
  const review = {
    title: entry.title.label.trim(),
    stars: parseInt(entry['im:rating'].label.trim()),
    content: entry.content.label.split('\n').map((line) => '> ' + line).join('\n'),
    author: entry.author.name.label
  }
  const message = engine.render('review.njk', { number, review, name: db[group][app].name, new: isNew })
  client.post(parseInt(group), message)
}
const cronJob = async (group, app) => {
  let reviews = await getReviews(app)
  reviews = reviews.slice(1)
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

  // ios list
  if (data.text === 'ios list') {
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

  // ios add
  let match = data.text.match(/^ios add ([a-z0-9]+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const reviews = await getReviews(app)
    const name = reviews[0]['im:name'].label
    db[group][app] = { name, reviews: reviews.slice(1) }
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

  // ios remove
  match = data.text.match(/^ios remove ([a-z0-9]+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    delete db[group][app]
    monitors[group][app].stop()
    delete monitors[group][app]
    client.post(group, 'done')
    saveDb(db)
    return
  }

  // ios reviews
  match = data.text.match(/^ios ([a-z0-9]+) reviews$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const reviews = db[group][app].reviews.map((review) => {
      return {
        title: review.title.label.trim(),
        stars: parseInt(review['im:rating'].label.trim()),
        author: review.author.name.label
      }
    })
    const message = engine.render('reviews.njk', { reviews, name: db[group][app].name })
    client.post(group, message)
    return
  }

  // ios review
  match = data.text.match(/^ios ([a-z0-9]+) review (\d+)$/)
  if (match !== null) {
    const app = RINGCENTRAL_APPS[match[1]] || match[1]
    const number = parseInt(match[2])
    notifyReview(group, app, number, false)
  }
})
