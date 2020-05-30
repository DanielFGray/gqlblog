import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
// import { WebSocketLink } from 'apollo-link-ws'
import Layout from './Layout'
import ErrorBoundary from './Error'

import 'normalize.css'
import './style.css'
import 'prism-themes/themes/prism-dracula.css'
import './font-awesome.css'

const { APP_BASE, MOUNT } = process.env

document.addEventListener('DOMContentLoaded', () => {
  if (! MOUNT) throw new Error('missing MOUNT env')

  const cache = new InMemoryCache()
  try {
    // eslint-disable-next-line no-underscore-dangle
    const initData = window.__INIT_DATA
    if (initData) {
      cache.restore(initData)
    }
  } catch (e) { console.error('failed to update cache', e) }

  // const websocketProtocol = NODE_ENV == 'production'
  //   ? 'wss'
  //   : 'ws'

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      onError(({ networkError, graphQLErrors }) => {
        if (graphQLErrors) {
          console.error(...graphQLErrors)
        }
        if (networkError) {
          console.error(networkError)
        }
      }),
      // new WebSocketLink({
      //   uri: `${websocketProtocol}://${APP_URL}/subscriptions`,
      //   options: {
      //     reconnect: true,
      //   },
      // }),
      new HttpLink({ credentials: 'same-origin', uri: '/graphql' }),
    ]),
    cache,
  })

  const init = (
    <ErrorBoundary didCatch={console.error}>
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
