/* global __non_webpack_require__:false */
/* eslint-disable no-console */
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import send from 'koa-send'
import koaHelmet from 'koa-helmet'
import { Helmet } from 'react-helmet'
import * as React from 'react'
import { StaticRouter } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import Html from './Html'
import Routes from './client/Routes'
import Layout from './client/Layout'

const {
  appBase,
  host,
  port,
  publicDir,
} = __non_webpack_require__('../config')

const app = new Koa()
const router = new Router()

app.use(koaHelmet())
app.use(bodyParser())

const getData = () => Promise.resolve({ list: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }] })

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  try {
    if (ctx.path !== '/') {
      return await send(ctx, ctx.path, { root: publicDir })
    }
  } catch (e) {
    /* fallthrough */
  }
  return next()
})

router.get('/robots.txt', async ctx => {
  ctx.set('Content-Type', 'text/plain')
  ctx.body = [
    'User-agent: *',
    'Disallow: /n/',
    'Disallow: /proxy/',
    'Disallow: /search/',
    'Disallow: /integration/',
  ].join('\n')
})

router.get('/api/v1', async ctx => {
  const body = await getData()
  ctx.json = { status: 'ok', body }
})

router.get('/api*', async ctx => {
  ctx.status = 500
  ctx.set('Content-Type', 'application/json')
  ctx.body = { status: 'error', body: 'not implemented' }
})

router.get(['/', '/*'], async ctx => {
  const data = await getData()
  const context = { ...data, query: ctx.query || {} }
  const children = (
    <StaticRouter basename={appBase} location={ctx.url} context={context}>
      <Layout>
        <Routes data={data} />
      </Layout>
    </StaticRouter>
  )
  let html = renderToString(children)
  const helmet = Helmet.rewind()
  html = renderToStaticMarkup(Html({ data, helmet, html }))
  if (context.url) {
    ctx.redirect(context.url)
  } else {
    ctx.body = html
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, host, () => console.log(`
  server now running on http://${host}:${port}`))

process.on('uncaughtException', console.error)
process.on('exit', () => console.log('exiting!'))
process.on('SIGINT', () => console.log('interrupted!'))

export default app
