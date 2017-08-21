const nunjucks = require('nunjucks')
const path = require('path')

const engine = nunjucks.configure(path.join(__dirname, '../../../views/review'), {
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true
})

module.exports = engine
