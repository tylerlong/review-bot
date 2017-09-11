const commonDb = require('../../common/db')

const loadDb = () => {
  return commonDb.loadDb('release/android')
}

const saveDb = (db) => {
  return commonDb.saveDb('release/android', db)
}

module.exports = { loadDb, saveDb }
