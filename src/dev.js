/* eslint-disable import/no-extraneous-dependencies, global-require */
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import WebpackBar from 'webpackbar'
import config from '../webpack.config'
import hotServer from './hotServerMiddleware'

export async function devMiddleware() {
  const multiCompiler = webpack(config)
  const clientCompiler = multiCompiler.compilers.find(c => c.name === 'client')

  multiCompiler.compilers.forEach(c => {
    new WebpackBar({
      profile: true,
      name: c.name,
    }).apply(c)

    c.hooks.done.tap('built', () => {
      console.log('finished building')
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
