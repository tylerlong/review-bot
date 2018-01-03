const rp = require('request-promise')
const { PRESET_REGIONS } = require('../common')

const getReviewsByRegion = async (id, region) => {
  const body = await rp(
    `https://itunes.apple.com/${region}/rss/customerreviews/page=1/sortBy=mostRecent/id=${id}/json`
  )
  const json = JSON.parse(body)
  return json.feed.entry
}
const getReviews = id => {
  let promises = Object.keys(PRESET_REGIONS).map(index =>
    getReviewsByRegion(id, PRESET_REGIONS[index])
  )
  return Promise.all(promises).then(rawArr => {
    let arr = []
    for (let i in rawArr) {
      rawArr[i] && arr.push(rawArr[i])
    }
    return arr
  })
}
const getFlattenReviews = async id => {
  let collections = await getReviews(id)
  let name
  let reviews = []
  for (let collection of collections) {
    if (!collection) continue
    name = collection.shift()['im:name'].label
    reviews = [...reviews, ...collection]
  }
  return { name, reviews }
}
module.exports = { getReviews, getFlattenReviews }
