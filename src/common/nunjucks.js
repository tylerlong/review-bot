const nunjucks = require('nunjucks')
const path = require('path')

const getEngine = (folder) => {
  return nunjucks.configure(path.join(__dirname, '../../views', folder), {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  })
}

module.exports = getEngine
