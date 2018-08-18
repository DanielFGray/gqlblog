/* eslint-disable no-console */
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import config from '../../config'
import routes from './routes'

const app = express()

app.use(morgan('common'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(config.publicDir))

app.use(config.appBase, routes)

const port = process.env.PORT || 8765
const host = process.env.HOST || 'localhost'

app.listen(port, host, () => console.log(
  `server now running on http://${host}:${port}`,
))
