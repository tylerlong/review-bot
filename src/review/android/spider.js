const rp = require('request-promise')
const { cid, api_secret } = require('./appfollow.json')
var crypto = require('crypto')
const md5 = string => {
  return crypto
    .createHash('md5')
    .update(string)
    .digest('hex')
}
const baseUrl = 'http://api.appfollow.io'
const getReviews = async packageName => {
  const uri = '/reviews'
  const sign = md5(`cid=${cid}ext_id=${packageName}${uri}${api_secret}`)
  const qs = { cid, ext_id: packageName, sign }
  let res = await rp({ baseUrl, qs, uri })
  try {
    res = JSON.parse(res).reviews
  } catch (e) {
    console.error(e)
    res = []
  }
  const reviews = res.list.slice(0, 51).filter(i => i.is_answer == 0)
  return reviews
}
module.exports = { getReviews }
