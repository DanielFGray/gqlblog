/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import {
  appBase, publicDir, port, host,
  devMode,
} from '../../config'
import routes from './routes'

const app = express()

app.use(morgan('common'))

app.use('/static', express.static(publicDir))
app.use(appBase, routes)

if (devMode) {
  require('./dev').default(app) // eslint-disable-line global-require
}

app.listen(port, host, () => console.log(`
  server now running on http://${host}:${port}`))
