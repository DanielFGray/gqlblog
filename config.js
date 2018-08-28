const path = require('path')

const outputDir = path.resolve('./dist')
const publicDir = path.join(outputDir, 'public')

module.exports = {
  appTitle: '[insert title]',
  outputDir,
  publicDir,
  appBase: '/',
  appMountId: 'root',
  port: process.env.PORT || 8765,
  host: process.env.HOST || 'localhost',
}
