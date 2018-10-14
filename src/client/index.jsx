import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Routes from './Routes'
import Layout from './Layout'
import { Provider } from '../createContext'
import './style.css'

const Init = initData => (
  <Provider value={{ initData: new Map(initData) }}>
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
    // eslint-disable-next-line no-underscore-dangle
    ReactDOM.hydrate(Init(window.__INIT_DATA), document.getElementById(__mount))
  })
}

export default Init
