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

document.addEventListener('DOMContentLoaded', () => {
  const apolloClient = new ApolloClient({
    link: new HttpLink({ credentials: 'same-origin', uri: '/graphql' }),
    // eslint-disable-next-line no-underscore-dangle
    cache: new InMemoryCache().restore(window.__INIT_DATA),
  })

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
