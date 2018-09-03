/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import { propEq } from 'ramda'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackHotServerMiddleware from 'webpack-hot-server-middleware'
import webpackConfig from '../webpack.config.babel'

export default app => {
  const compiler = webpack(webpackConfig)
  new ProgressPlugin().apply(compiler)
  app.use(webpackDevMiddleware(compiler, {}))
  app.use(webpackHotMiddleware(compiler.compilers.find(propEq('name', 'client'))))
  // app.use(webpackHotServerMiddleware(compiler))
}
