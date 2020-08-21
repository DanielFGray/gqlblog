/* eslint-disable import/no-extraneous-dependencies, global-require */
import { spawn } from 'child_process'
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import WebpackBar from 'webpackbar'
import fetch from 'isomorphic-unfetch'
import * as R from 'ramda'
import chalk from 'chalk'
import config from '../webpack.config'

const { APP_URL } = process.env

// this is cool?
let watchingQueries = false

const prettyCodegen = R.pipe(
  R.toString,
  R.split('\n'),
  R.filter(Boolean),
  R.map(
    R.pipe(
      R.replace(/^(\[[0-9:]+\])?\s*/, ''),
      R.cond([
        [R.endsWith('[failed]'), chalk.red.bold],
        [R.endsWith('[completed]'), chalk.green],
        [R.includes('ℹ'), chalk.blue],
        [R.T, R.identity],
      ]),
      x => `${chalk.gray('gql-codegen:')} ${x}`,
    ),
  ),
  x => process.stdout.write(`${x.join('\n')}\n`),
)

/* eslint-disable-next-line import/prefer-default-export */
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
        if (!watchingQueries) {
          watchingQueries = true
          spawn('yarn', ['-s', 'graphql-codegen', '--watch'], {
            stdio: [null, 'pipe'],
          })
            .on('exit', () => {
              watchingQueries = false
            })
            .stdout.on('data', prettyCodegen)
        }

        await Promise.all([
          // FIXME: these should be tests
          fetch(`http://${APP_URL}/`),
          fetch(`http://${APP_URL}/projects`),
          fetch(`http://${APP_URL}/music/rudimental-permutations`),
        ])
      } catch (e) {
        console.error(e)
      }
    })
  })

  const hotClient = await koaWebpack({
    compiler: clientCompiler,
    devMiddleware: {
      serverSideRender: true,
      logLevel: 'trace',
      publicPath: '/',
      // stats: false,
      stats: {
        chunks: true,
        chunkModules: false,
        colors: true,
        modules: false,
        children: false,
      },
    },
  })

  return hotClient
}
