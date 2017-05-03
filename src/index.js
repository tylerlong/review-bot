require('dotenv').config()
const path = require('path')
const fs = require('fs')
const { engine } = require('./nunjucks')
const { getReviews } = require('./spider')
const client = require('./glip')

const RINGCENTRAL_APPS = {
  glip: 715886894,
  ringcentral: 293305984,
  meetings: 688920955
}

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json')))

client.on('message', async (type, data) => {
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
    let match = data.text.match(/^app add ([a-z0-9]+)$/)
    if (match !== null) {
      const app = RINGCENTRAL_APPS[match[1]] || match[1]
      const reviews = await getReviews(app)
      const name = reviews[0]['im:name'].label
      db[group][app] = { name, reviews: reviews.slice(1) }
      client.post(group, name)
      fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(db))
      return
    }

    // app remove
    match = data.text.match(/^app remove ([a-z0-9]+)$/)
    if (match !== null) {
      const app = RINGCENTRAL_APPS[match[1]] || match[1]
      delete db[group][app]
      fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(db))
      return
    }

    // app reviews
    match = data.text.match(/^app ([a-z0-9]+) reviews$/)
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

    // app review
    match = data.text.match(/^app ([a-z0-9]+) review (\d+)$/)
    if (match !== null) {
      const app = RINGCENTRAL_APPS[match[1]] || match[1]
      const number = parseInt(match[2])
      const entry = db[group][app].reviews[number - 1]
      const review = {
        id: entry.id.label,
        title: entry.title.label.trim(),
        stars: parseInt(entry['im:rating'].label.trim()),
        content: entry.content.label.split('\n').map((line) => '> ' + line).join('\n'),
        author: entry.author.name.label
      }
      const message = engine.render('review.njk', { number, review, name: db[group][app].name })
      client.post(group, message)
    }
  }
})
