import Koa from 'koa'
import kcompose from 'koa-compose'
import koaHelmet from 'koa-helmet'
// import KoaRouter from 'koa-router'
import { ApolloServer } from 'apollo-server-koa'
import send from 'koa-send'
import schema from './schema'
import SSR from './SSR'

const { PUBLIC_DIR } = process.env

export const logErrors: Koa.Middleware = async (ctx, next) => {
  // FIXME: better error handling?
  try {
    await next()
  } catch (e) {
    console.error(e)
    ctx.status = 500
    ctx.body = 'Internal Server Error'
  }
}

export const logger: Koa.Middleware = async (ctx, next) => {
  const start = Date.now()
  await next()
  const time = `${Date.now() - start}ms`
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${time}`)
}

export const staticFiles: Koa.Middleware = async (ctx, next) => {
  try {
    if (ctx.path !== '/') {
      return await send(ctx, ctx.path, { root: PUBLIC_DIR })
    }
  } catch (e) { /* fallthrough */ }
  return next()
}

export default function app(): Koa.Middleware {
  const apolloServer = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
  })
  return kcompose([
    koaHelmet(),
    logErrors,
    logger,
    staticFiles,
    apolloServer.getMiddleware(),
    SSR,
  ])
}
