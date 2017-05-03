const rp = require('request-promise')

const getReviews = async (id) => {
  const body = await rp(`https://itunes.apple.com/us/rss/customerreviews/page=1/sortBy=mostRecent/id=${id}/json`)
  const json = JSON.parse(body)
  return json.feed.entry
}

module.exports = { getReviews }
