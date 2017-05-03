const path = require('path')
const fs = require('fs')

const loadDb = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json')))
}

const saveDb = (db) => {
  fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(db))
}

module.exports = { loadDb, saveDb }
