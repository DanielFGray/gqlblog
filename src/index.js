import Koa from 'koa'
import koaHelmet from 'koa-helmet'
import { ApolloServer } from 'apollo-server-koa'
import { logger, staticFiles } from './koaMiddleware'
import schema from './schema'
import SSR from './SSR'

const {
  appBase,
  host,
  port,
  publicDir,
} = __non_webpack_require__('../config')

const main = async () => {
  const app = new Koa()
    .use(koaHelmet())
    .use(logger())
    .use(staticFiles({ root: publicDir }))

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })

  app
    .use(SSR({ appBase, schema }))
    .listen(port, host, () => console.log(`
    server now running on http://${host}:${port}`))
}
main()

process.on('exit', () => console.log('exiting!'))
process.on('SIGINT', () => {
  console.log('interrupted!')
  process.exit(1)
})
process.on('uncaughtException', e => {
  console.error(e)
  process.exit(1)
})
