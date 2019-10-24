import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { renderToStringWithData } from '@apollo/react-ssr'
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Html from './Html'
import Layout from './client/Layout'

export default function SSR({ appBase, schema }) {
  return async ctx => {
    const link = new SchemaLink({ schema })
    const cache = new InMemoryCache()
    const client = new ApolloClient({ link, cache, ssrMode: true })

    const routerCtx = {}
    const helmetCtx = {}
    const App = (
      <ApolloProvider client={client}>
        <StaticRouter
          basename={appBase}
          location={ctx.url}
          context={routerCtx}
        >
          <HelmetProvider context={helmetCtx}>
            <Layout />
          </HelmetProvider>
        </StaticRouter>
      </ApolloProvider>
    )
    try {
      const html = await renderToStringWithData(App)
      const { helmet } = helmetCtx
      const data = client.extract()
      const body = renderToStaticMarkup(Html({ data, helmet, html }))
      if (routerCtx.status) {
        ctx.status = routerCtx.status
      }
      if (routerCtx.url) {
        ctx.redirect(routerCtx.url)
      } else {
        ctx.body = `<!doctype html>${body}`
      }
    } catch (e) {
      ctx.status = 500
      ctx.body = 'Error'
      console.error(e)
      process.exit(1)
    }
  }
}
