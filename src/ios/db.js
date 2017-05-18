const commonDb = require('../common/db')

const loadDb = () => {
  return commonDb.loadDb('ios')
}

const saveDb = (db) => {
  return commonDb.saveDb('ios', db)
}

module.exports = { loadDb, saveDb }
