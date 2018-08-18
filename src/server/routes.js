import express from 'express'
import config from '../../config'

const app = express.Router()

app.get('/api/v1', (req, res) => {
  const data = { status: 'ok', body: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }] }
  res.json(data)
})

app.get('/api/*', (req, res) => {
  const data = { status: 'error', body: 'not implemented' }
  res.status(500).json(data)
})

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: config.publicDir })
})


export default app
