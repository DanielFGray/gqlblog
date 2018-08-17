const path = require('path')

const outputDir = path.resolve('./dist')
const publicDir = path.join(outputDir, 'public')

module.exports = {
  outputDir,
  publicDir,
  appBase: '/',
}
