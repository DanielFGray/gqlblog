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

document.addEventListener('DOMContentLoaded', () => {
  const initData = window.__INIT_DATA // eslint-disable-line no-underscore-dangle
  const props = typeof initData === 'object' ? initData : {}
  ReactDOM.hydrate(<Init rootProps={props} />, document.getElementById(__MOUNT))
})
