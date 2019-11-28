import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { renderToStringWithData } from '@apollo/react-ssr'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Html from './Html'
import Layout from './client/Layout'

const getAssets = ctx => {
  const list = Object.values(
    process.env.NODE_ENV === 'production' ?
    ctx.state.manifest
    : ctx.state.webpackStats.toJson().assetsByChunkName.main
  )
  return list.reduce((p, x) => {
    if (/\.css$/.test(x)) {
      p[0].push(x)
    } else if (/\.js$/.test(x)) {
      p[1].push(x)
    }
    return p
  }, [[], []])
}

export default function SSR({ appBase, schema }) {
  const link = new SchemaLink({ schema })
  return async ctx => {
    const [styles, scripts] = getAssets(ctx)
    const cache = new InMemoryCache()
    const client = new ApolloClient({ link, cache, ssrMode: true })

    const routerCtx = {}
    const helmetCtx = {}
    const init = (
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
    const html = await renderToStringWithData(init)
    const { helmet } = helmetCtx
    const data = { __INIT_DATA: client.extract() }
    const body = renderToStaticMarkup(Html({ data, helmet, html, scripts, styles, appBase }))
    if (routerCtx.status) {
      ctx.status = routerCtx.status
    }
    if (routerCtx.url) {
      ctx.redirect(routerCtx.url)
    } else {
      ctx.body = `<!doctype html>${body}`
    }
  }
}
