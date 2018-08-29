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
  const json = JSON.parse(window.__INIT_DATA)
  const props = typeof json === 'object' ? json : {}
  ReactDOM.hydrate(<Init rootProps={props} />, document.getElementById(__MOUNT))
})
