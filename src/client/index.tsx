import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider, ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { onError } from '@apollo/client/link/error'
// import { WebSocketLink } from 'apollo-link-ws'
import Layout from './Layout'
import ErrorBoundary from './Error'

import 'normalize.css'
import './style.css'
import 'prism-themes/themes/prism-dracula.css'
import './font-awesome.css'

const { APP_BASE, MOUNT } = process.env

document.addEventListener('DOMContentLoaded', () => {
  if (!MOUNT) throw new Error('missing MOUNT env')

  const cache = new InMemoryCache()
  try {
    const initData = document.getElementById('initData')?.innerText // eslint-disable-next-line no-underscore-dangle
    if (initData) cache.restore(JSON.parse(initData))
  } catch (e) {
    console.error('failed to update cache', e)
  }

  // const websocketProtocol = NODE_ENV == 'production'
  //   ? 'wss'
  //   : 'ws'

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      onError(({ networkError, graphQLErrors }) => {
        if (graphQLErrors) console.error(...graphQLErrors)
        if (networkError) console.error(networkError)
      }),
      // new WebSocketLink({
      //   uri: `${websocketProtocol}://${APP_URL}/subscriptions`,
      //   options: {
      //     reconnect: true,
      //   },
      // }),
      new HttpLink({
        credentials: 'same-origin',
        uri: '/graphql',
      }),
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
