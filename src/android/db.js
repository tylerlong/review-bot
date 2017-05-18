const commonDb = require('../common/db')

const loadDb = () => {
  return commonDb.loadDb('android')
}

const saveDb = (db) => {
  return commonDb.saveDb('android', db)
}

module.exports = { loadDb, saveDb }
