const path = require('path')
const fs = require('fs')

const loadDb = (dbName = 'ios') => {
  const dbPath = path.join(__dirname, `../db/${dbName}.json`)
  if (!fs.existsSyncdbPath) {
    fs.writeFileSync(dbPath, '{}')
  }
  return JSON.parse(fs.readFileSync(dbPath))
}

const saveDb = (db, dbName = 'ios') => {
  const dbPath = path.join(__dirname, `../db/${dbName}.json`)
  fs.writeFileSync(dbPath, JSON.stringify(db))
}

module.exports = { loadDb, saveDb }
