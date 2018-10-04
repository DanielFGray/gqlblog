import Router from 'koa-router'
import db from './db'

const api = new Router()
  .get('/api/v1', async ctx => {
    const body = await db('messages').select()
    ctx.body = { status: 'ok', body }
  })

  .post('/api/v1', async ctx => {
    const body = await db('messages').insert(ctx.request.body)
      .then(() => db('messages').select())
    ctx.body = { status: 'ok', body }
  })

  .all('/api/*', async ctx => {
    ctx.status = 500
    ctx.body = { status: 'error', body: 'not implemented' }
  })

export default api
