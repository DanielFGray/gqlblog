import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Routes from './Routes'
import Layout from './Layout'
import { Provider } from '../createContext'
import './style.css'

const Init = data => (
  <Provider value={data}>
    <Router basename={__appBase}>
      <HelmetProvider>
        <Layout>
          <Routes />
        </Layout>
      </HelmetProvider>
    </Router>
  </Provider>
)

if (document) {
  document.addEventListener('DOMContentLoaded', () => {
    const initData = window.__INIT_DATA // eslint-disable-line no-underscore-dangle
    ReactDOM.hydrate(Init(initData), document.getElementById(__mount))
  })
}

export default Init
