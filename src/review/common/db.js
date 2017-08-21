const path = require('path')
const fs = require('fs')

const loadDb = (dbName) => {
  const dbPath = path.join(__dirname, `../../../db/${dbName}.json`)
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '{}')
  }
  return JSON.parse(fs.readFileSync(dbPath))
}

const saveDb = (dbName, db) => {
  const dbPath = path.join(__dirname, `../../../db/${dbName}.json`)
  fs.writeFileSync(dbPath, JSON.stringify(db))
}

module.exports = { loadDb, saveDb }
