/* global __non_webpack_require__:false */
/* eslint-disable no-console */
import knex from 'knex'

const config = __non_webpack_require__('../knexfile')
const env = process.env.NODE_ENV || 'development'

export default knex(config[env])
