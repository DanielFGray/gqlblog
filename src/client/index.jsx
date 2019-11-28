import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'normalize.css'
import 'prismjs/themes/prism-okaidia.css'
import './style.css'

import Layout from './Layout'
import ErrorBoundary from './Error'
import Stringify from './Stringify'

function handleError({ error, info }) {
  console.log({ error, info })
}

const { APP_BASE, MOUNT } = process.env

document.addEventListener('DOMContentLoaded', () => {
  const cache = new InMemoryCache()
  try {
    // eslint-disable-next-line no-underscore-dangle
    const initData = JSON.parse(window.__INIT_DATA)
    if (initData) {
      cache.restore(initData)
    }
  } catch (e) { /* fallthrough */ }
  const apolloClient = new ApolloClient({
    link: new HttpLink({ credentials: 'same-origin', uri: '/graphql' }),
    cache,
  })
  const init = (
    <ErrorBoundary fallback={Stringify} didCatch={handleError}>
      <ApolloProvider client={apolloClient}>
        <Router basename={APP_BASE}>
          <HelmetProvider>
            <Layout />
          </HelmetProvider>
        </Router>
      </ApolloProvider>
    </ErrorBoundary>
  )
  const root = document.getElementById(MOUNT)
  ReactDOM.hydrate(init, root)
})
