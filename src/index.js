/* eslint-disable no-console */
import Koa from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import koaHelmet from 'koa-helmet'
import { makeExecutableSchema } from 'graphql-tools'
import { ApolloServer } from 'apollo-server-koa'
import SSR from './SSR'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const {
  appBase,
  host,
  port,
  publicDir,
} = __non_webpack_require__('../config')

const schema = makeExecutableSchema({ typeDefs, resolvers })
const apolloServer = new ApolloServer({ schema })

const ssr = new Router()
  .all('/*', SSR({ appBase, schema }))

const app = new Koa()
  .use(koaHelmet())

  .use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${rt}`)
  })

  .use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  .use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  })

apolloServer.applyMiddleware({ app })

app
  .use(async (ctx, next) => {
    try {
      if (ctx.path !== '/') {
        return await send(ctx, ctx.path, { root: publicDir })
      }
    } catch (e) { /* fallthrough */ }
    return next()
  })

  .use(ssr.allowedMethods())
  .use(ssr.routes())

  .listen(port, host, () => console.log(`
    server now running on http://${host}:${port}`))

process.on('exit', () => console.log('exiting!'))
process.on('SIGINT', () => console.log('interrupted!'))
process.on('uncaughtException', e => {
  console.error(e)
  process.exit(1)
})

export default app
