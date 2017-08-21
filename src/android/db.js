const commonDb = require('../common/db')

const loadDb = () => {
  return commonDb.loadDb('review/android')
}

const saveDb = (db) => {
  return commonDb.saveDb('review/android', db)
}

module.exports = { loadDb, saveDb }
