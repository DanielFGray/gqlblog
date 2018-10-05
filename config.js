const path = require('path')

const appTitle = '[insert title]'
const appBase = ''
const mount = 'root'
const outputDir = path.resolve('./dist')
const publicDir = path.resolve('./public')
const port = process.env.PORT || 8765
const host = process.env.HOST || 'localhost'
const nodeEnv = process.env.NODE_ENV || 'development'
const devMode = nodeEnv.startsWith('dev')
const fullUrl = devMode
  ? `http://${host}:${port}${appBase.startsWith('/') || '/'}${appBase}`
  : `https://${host}${appBase.startsWith('/') || '/'}${appBase}`

module.exports = {
  appTitle,
  appBase,
  fullUrl,
  mount,
  outputDir,
  publicDir,
  port,
  host,
  nodeEnv,
  devMode,
}
