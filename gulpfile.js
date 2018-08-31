/* eslint-disable no-console,import/no-dynamic-require,global-require */
const path = require('path')
const gulp = require('gulp')
const watch = require('gulp-watch')
const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
require('@babel/register')

const webpackPath = './webpack.config.babel.js'
let webpackConfig = require(webpackPath).default

const watcher = from => {
  from.watch({
    ignored: /node_modules/,
  }, (err, stats) => {
    if (err) console.error(err)
    console.log(stats.toString({
      chunks: false,
      chunkModules: false,
      colors: true,
    }))
  })
}

const compiler = config => {
  const c = webpack(config)
  new ProgressPlugin().apply(c)
  return c
}

gulp.task('start', () => {
  let wbc = watcher(compiler(webpackConfig))
  watch([webpackPath], () => {
    console.log('loading new webpack config')
    delete require.cache[path.resolve(webpackPath)]
    webpackConfig = require(webpackPath).default
    wbc.close(() => {
      wbc = watcher(compiler(webpackConfig))
    })
  })
})

gulp.task('build', cb => {
  compiler(webpackConfig).run((err, stats) => {
    if (err) console.error(err)
    console.log(stats.toString({
      chunks: false,
      colors: true,
    }))
    cb()
  })
})

