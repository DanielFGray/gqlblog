import 'dotenv/config'
import http from 'http'
import Koa from 'koa'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { promises as fs } from 'fs'
import app from './app'
import schema from './schema'

const { NODE_ENV, PORT, HOST, APP_URL } = process.env

const die = (e?: Error | string) => {
  if (e) console.error(e)
  process.exit(1)
}

async function main() {
  const koa = new Koa()

  if (NODE_ENV !== 'development') {
    const manifest = JSON.parse(await fs.readFile('./dist/manifest.json', 'utf8'))
    koa.use(async (ctx, next) => {
      ctx.state.manifest = manifest
      await next()
    })
  } else {
    const { devMiddleware } = await import('./dev')
    koa.use(await devMiddleware())
  }
  koa.use(app())

  const server = http.createServer(koa.callback())
  await new Promise(res => { server.listen(Number(PORT), HOST, res) })
  console.info(`server now running on http://${APP_URL}`)
  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    },
  )
}
main().catch(die)

process.on('exit', () => die('exiting!'))
process.on('SIGINT', () => die('interrupted!'))
process.on('uncaughtException', die)
