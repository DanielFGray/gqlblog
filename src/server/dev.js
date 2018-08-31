/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import wdm from 'webpack-dev-middleware'
import webpackConfig from '../../webpack.config.babel'

export default app => {
  app.use(wdm(webpack(webpackConfig)))
}
