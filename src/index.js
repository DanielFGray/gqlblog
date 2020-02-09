import 'dotenv/config'
import http from 'http'
import Koa from 'koa'
import { promises as fs } from 'fs'
import app from './app'

const { NODE_ENV, PORT, HOST } = process.env

const die = e => {
  console.error(e)
  process.exit(1)
}

async function main() {
  const koa = new Koa()

  if (NODE_ENV === 'development') {
    const { devMiddleware } = await import('./dev')
    const { hotClient, hotServer } = await devMiddleware()
    koa.use(hotClient)
  } else {
    const manifest = JSON.parse(await fs.readFile('./dist/manifest.json'))
    koa.use(async (ctx, next) => {
      ctx.state.manifest = manifest
      await next()
    })
  }
  koa.use(app())

  const server = http.createServer(koa.callback())
  await new Promise(res => { server.listen(PORT, HOST, res) })
  console.info(`server now running on http://${HOST}:${PORT}`)
}
main().catch(die)

process.on('exit', () => die('exiting!'))
process.on('SIGINT', () => die('interrupted!'))
process.on('uncaughtException', die)
