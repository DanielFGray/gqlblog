/* global __APPBASE:false, __MOUNT:false */
import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import Layout from './Layout'
import './style.css'

const Init = props => (
  <Router basename={__APPBASE}>
    <Layout>
      <Routes {...props} />
    </Layout>
  </Router>
)

document.addEventListener('DOMContentLoaded', () => {
  // const initData = window.__INIT_DATA // eslint-disable-line no-underscore-dangle
  // ReactDOM.hydrate(<Init initData={initData} />, document.getElementById(__MOUNT))
})
