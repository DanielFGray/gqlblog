import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'normalize.css'
import 'prismjs/themes/prism-okaidia.css'
import './style.css'

import Layout from './Layout'

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-underscore-dangle
  const cache = new InMemoryCache().restore(window.__INIT_DATA)
  const link = new HttpLink({ credentials: 'same-origin', uri: '/graphql' })
  const apolloClient = new ApolloClient({ cache, link })

  ReactDOM.hydrate((
    <ApolloProvider client={apolloClient}>
      <Router basename={__appBase}>
        <HelmetProvider>
          <Layout />
        </HelmetProvider>
      </Router>
    </ApolloProvider>
  ), document.getElementById(__mount))
})
