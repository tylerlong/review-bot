const commonDb = require('../../common/db')

const loadDb = () => {
  return commonDb.loadDb('release/ios')
}

const saveDb = (db) => {
  return commonDb.saveDb('release/ios', db)
}

module.exports = { loadDb, saveDb }
