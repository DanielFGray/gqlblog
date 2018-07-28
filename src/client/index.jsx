import React from 'react'
import ReactDOM from 'react-dom'
import Main from './Main'
import './style.css'

const Init = (
  // state management, routing..
  <Main />
)

const root = document.getElementById('root')
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(Init, root)
})
const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  require('webpack-serve-overlay') // eslint-disable-line global-require
}
