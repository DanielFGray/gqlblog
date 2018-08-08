/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'

const app = express()

app.use(morgan('common'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const outDir = path.resolve(path.join('dist', 'public'))

app.use(express.static(outDir))

app.get('/api/v1', (req, res) => {
  Promise.resolve({ status: 'ok', body: [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }] })
    .then(data => res.json(data))
})

app.get('/api/*', (req, res) => {
  Promise.reject({ status: 'error', body: 'not implemented' })
    .catch(data => res.status(500).json(data))
})

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: outDir })
})

const port = process.env.PORT || 8765
const host = process.env.HOST || 'localhost'

app.listen(port, host, () => console.log(
  `server now running on http://${host}:${port}`,
))
