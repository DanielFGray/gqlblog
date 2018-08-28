/* global __APPBASE:false, __MOUNT:false */
import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import Layout from './Layout'
import './style.css'

const Init = props => (
  <Layout>
    <Router basename={__APPBASE}>
      <Routes {...props} />
    </Router>
  </Layout>
)

const root = document.getElementById(__MOUNT)

document.addEventListener('DOMContentLoaded', () => {
  /* eslint-disable no-underscore-dangle */
  const initData = JSON.parse(document.getElementById('initialData').getAttribute('data-json'))
  const props = typeof initData === 'object' ? initData : {}
  ReactDOM.hydrate(<Init {...props} />, root)
})
