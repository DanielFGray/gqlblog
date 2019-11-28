import Router from 'koa-router'
import koaHelmet from 'koa-helmet'
// import KoaRouter from 'koa-router'
import { ApolloServer } from 'apollo-server-koa'
import { logger, staticFiles } from './koaMiddleware'
import schema from './schema'
import SSR from './SSR'

const {
  APP_BASE: appBase,
  PUBLIC_DIR: root,
} = process.env

export default async function app(app) {
  app.use(async (ctx, next) => {
    // FIXME: better error handling?
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
      ctx.body = 'Internal Server Error'
      process.exit(1)
    }
  })

  app.use(koaHelmet())
  app.use(logger())
  app.use(koaHelmet())
  app.use(staticFiles({ root }))

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })

  app.use(SSR({ appBase, schema }))

  return app
}
