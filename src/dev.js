/* eslint-disable global-require,import/no-extraneous-dependencies */
export async function addDevMiddleware(app) {
  const webpack = require('webpack')
  const koaWebpack = require('koa-webpack')
  const config = require('../webpack.config')
  const WebpackBar = require('webpackbar')

  const compiler = webpack(config)
  const clientCompiler = compiler.compilers.find(c => c.name === 'client')

  const bar = new WebpackBar({
    profile: true,
    fancy: true,
  })

  bar.apply(clientCompiler)

  app.use(await koaWebpack({
    compiler: clientCompiler,
    devMiddleware: {
      serverSideRender: true,
      stats: {
        chunks: true,
        chunkModules: false,
        colors: true,
        modules: false,
        children: false,
      },
    },
  }))

  // app.use(require('./hotServerMiddleware').default(compiler))
  return compiler
}
