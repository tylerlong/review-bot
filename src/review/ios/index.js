const { CronJob } = require('cron')

const client = require('../../common/glip')
const { engine, PRESET_APPS } = require('../common')
const { loadDb, saveDb } = require('./db')
const { getReviews, getFlattenReviews } = require('./spider')
const { compareReviews, mergeReviews } = require('./util')

const db = loadDb()
const IOS_PRESET_APPS = PRESET_APPS.ios

const monitors = {}
const notifyReview = (group, app, number, isNew) => {
  const entry = db[group][app].reviews[number - 1]
  const review = {
    title: entry.title.label.trim(),
    stars: parseInt(entry['im:rating'].label.trim()),
    content: entry.content.label
      .split('\n')
      .map(line => '> ' + line)
      .join('\n'),
    author: entry.author.name.label
  }
  const message = engine.render('ios/review.njk', {
    number,
    review,
    name: db[group][app].name,
    new: isNew
  })
  client.post(parseInt(group), message)
}
const cronJob = async (group, app) => {
  let reviewCollections = await getReviews(app)
  reviewCollections.forEach(i => i && i.shift())
  var oldReviews = db[group][app].reviews
  for (let index in reviewCollections) {
    let reviews = reviewCollections[index]
    const delta = compareReviews(oldReviews, reviews)
    db[group][app].reviews = mergeReviews(oldReviews, reviews)
    delta.forEach(number => {
      notifyReview(group, app, number, true)
    })
    saveDb(db)
  }
}
Object.keys(db).forEach(group => {
  monitors[group] = {}
  Object.keys(db[group]).forEach(app => {
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
  if (data.text === 'review ios list') {
    const apps = Object.keys(db[group]).map(app => {
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
  let match = data.text.match(/^review ios add ([a-z0-9]+)$/)
  if (match !== null) {
    const app = IOS_PRESET_APPS[match[1]] || match[1]
    const reviews = await getFlattenReviews(app)
    db[group][app] = reviews
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
  match = data.text.match(/^review ios remove ([a-z0-9]+)$/)
  if (match !== null) {
    const app = IOS_PRESET_APPS[match[1]] || match[1]
    delete db[group][app]
    monitors[group][app].stop()
    delete monitors[group][app]
    client.post(group, 'done')
    saveDb(db)
    return
  }

  // ios reviews
  match = data.text.match(/^review ios ([a-z0-9]+) reviews$/)
  if (match !== null) {
    const app = IOS_PRESET_APPS[match[1]] || match[1]
    const reviews = db[group][app].reviews.map(review => {
      return {
        title: review.title.label.trim(),
        stars: parseInt(review['im:rating'].label.trim()),
        author: review.author.name.label
      }
    })
    const message = engine.render('ios/reviews.njk', {
      reviews,
      name: db[group][app].name
    })
    client.post(group, message)
    return
  }

  // ios review
  match = data.text.match(/^review ios ([a-z0-9]+) review (\d+)$/)
  if (match !== null) {
    const app = IOS_PRESET_APPS[match[1]] || match[1]
    const number = parseInt(match[2])
    notifyReview(group, app, number, false)
  }
})
