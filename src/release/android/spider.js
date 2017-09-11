const rp = require('request-promise')
const cheerio = require('cheerio')

const lookup = async (id) => {
  try {
    const body = await rp(`https://play.google.com/store/apps/details?id=${id}`)
    const $ = cheerio.load(body)
    const name = $('div.id-app-title').text().trim()
    const releaseDate = $('div[itemprop="datePublished"]').text().trim()
    const version = $('div[itemprop="softwareVersion"]').text().trim()
    return { name, version, releaseDate }
  } catch (err) {
    return null
  }
}

module.exports = { lookup }
