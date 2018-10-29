import Koa from 'koa'
import koaHelmet from 'koa-helmet'
import { ApolloServer } from 'apollo-server-koa'
import SSR from './SSR'
import schema from './schema'
import {
  logger,
  timer,
  errHandler,
  staticFiles,
} from './koaMiddleware'

const {
  appBase,
  host,
  port,
  publicDir,
} = __non_webpack_require__('../config')

const app = new Koa()

app
  // .use(koaHelmet)
  .use(errHandler)
  .use(logger)
  .use(timer)

const apolloServer = new ApolloServer({ schema })
apolloServer.applyMiddleware({ app })

app
  .use(staticFiles({ publicDir }))
  .use(SSR({ appBase, schema }))
  .listen(port, host, () => console.log(`
    server now running on http://${host}:${port}`))

process.on('exit', () => console.log('exiting!'))
process.on('SIGINT', () => console.log('interrupted!'))
process.on('uncaughtException', e => {
  console.error(e)
  process.exit(1)
})

export default app
