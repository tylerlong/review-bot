const google = require('googleapis')
const key = require('./key.json')

const scopes = ['https://www.googleapis.com/auth/androidpublisher']

const jwtAuth = new google.auth.JWT(key.client_email, null, key.private_key, scopes, null)

const getReviews = (packageName) => {
  return new Promise((resolve, reject) => {
    jwtAuth.authorize((err, tokens) => {
      if (err) {
        return reject(err)
      }
      google.androidpublisher('v2').reviews.list({ auth: jwtAuth, packageName: packageName }, function (err, resp) {
        if (err) {
          return reject(err)
        }
        if (resp.reviews) {
          return resolve(resp.reviews)
        } else {
          return resolve([])
        }
      })
    })
  })
}

module.exports = { getReviews }
