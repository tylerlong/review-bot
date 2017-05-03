require('dotenv').config()
const GlipSocket = require('glip.socket.io')
const { engine } = require('./nunjucks')
const { getReviews } = require('./spider')

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
      return
    }

    // app remove
    match = data.text.match(/^app remove ([a-z0-9]+)$/)
    if (match !== null) {
      const app = RINGCENTRAL_APPS[match[1]] || match[1]
      delete db[group][app]
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

    if (1 === 1) {

    }
  }
})

client.start()
