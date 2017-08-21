const commonDb = require('../common/db')

const loadDb = () => {
  return commonDb.loadDb('review/ios')
}

const saveDb = (db) => {
  return commonDb.saveDb('review/ios', db)
}

module.exports = { loadDb, saveDb }
