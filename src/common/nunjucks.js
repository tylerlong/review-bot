const nunjucks = require('nunjucks')
const path = require('path')

const createEngine = (folderName) => {
  return nunjucks.configure(path.join(__dirname, '../../views', folderName), {
    autoescape: false,
    trimBlocks: true,
    lstripBlocks: true
  })
}

module.exports = createEngine
