/* global __non_webpack_require__:false */
/* eslint-disable no-console */
import * as React from 'react'
import { StaticRouter } from 'react-router'
import express from 'express'
import morgan from 'morgan'
import { endsWith } from 'ramda'
import Html from './Html'
import Routes from './client/Routes'
import Layout from './client/Layout'
import { partition } from './utils'

const config = __non_webpack_require__('../config')
const manifest = __non_webpack_require__('./manifest.json')

const {
  appBase,
  host,
  port,
  publicDir,
} = config

const app = express()

app.use(morgan('dev'))

app.use(express.static(publicDir))

const [styles, scripts] = partition([
  endsWith('.css'),
  endsWith('.js'),
], Object.values(manifest))

const getData = () => Promise.resolve({ list: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }] })

app.get('/api/v1', async (req, res) => {
  const body = await getData()
  res.json({ status: 'ok', body })
})

app.get('/api*', (req, res) => {
  res.status(500)
    .json({ status: 'error', body: 'not implemented' })
})

app.get('/', (req, res) => {
  getData().then(data => {
    const context = data
    const children = (
      <StaticRouter basename={appBase} location={req.url} context={context}>
        <Layout>
          <Routes data={data} />
        </Layout>
      </StaticRouter>
    )
    try {
      const html = Html({ styles, scripts, data, children })
      if (context.url) {
        res.writeHead(302, {
          Location: context.url,
        })
        res.end()
      } else {
        res.end(html)
      }
    } catch (e) {
      console.error(e)
      res.status(501)
        .json(e)
    }
  })
})

app.listen(port, host, () => console.log(`
  server now running on http://${host}:${port}`))

process.on('uncaughtException', console.error)

process.on('exit', () => console.log('exiting!'))
process.on('SIGINT', () => console.log('interrupted!'))

export default app
