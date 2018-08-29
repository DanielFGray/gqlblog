/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import {
  appBase, publicDir, port, host,
} from '../../config'
import routes from './routes'

const app = express()

app.use(morgan('common'))

console.log(publicDir)
app.use('/static', express.static(publicDir))
app.use(appBase, routes)

app.listen(port, host, () => console.log(
  `server now running on http://${host}:${port}`,
))
