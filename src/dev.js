/* eslint-disable import/no-extraneous-dependencies, global-require */
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import WebpackBar from 'webpackbar'
import fetch from 'isomorphic-unfetch'
import config from '../webpack.config'
import hotServer from './hotServerMiddleware'

const { HOST, PORT } = process.env

export async function devMiddleware() {
  const multiCompiler = webpack(config)
  const clientCompiler = multiCompiler.compilers.find(c => c.name === 'client')

  multiCompiler.compilers.forEach(c => {
    new WebpackBar({
      profile: true,
      name: c.name,
    }).apply(c)

    c.hooks.done.tap('built', async () => {
      try {
        // FIXME: these should be tests
        await Promise.all([fetch(`http://${HOST}:${PORT}/`), fetch(`http://${HOST}:${PORT}/projects`),])
      } catch (e) {
        console.error(e)
      }

    })
  })

  return {
    hotServer: hotServer(multiCompiler),
    hotClient: await koaWebpack({
      compiler: clientCompiler,
      devMiddleware: {
        serverSideRender: true,
        logLevel: 'trace',
        // stats: false,
        stats: {
          chunks: true,
          chunkModules: false,
          colors: true,
          modules: false,
          children: false,
        },
      },
    }),
  }
}
