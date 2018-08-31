/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import wdm from 'webpack-dev-middleware'
import webpackConfig from '../../webpack.config.babel'
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

export default app => {
  const compiler = webpack(webpackConfig)
  new ProgressPlugin().apply(compiler)
  app.use(wdm(compiler))
}
