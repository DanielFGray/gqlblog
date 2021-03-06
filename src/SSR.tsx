import Koa from 'koa'
import React from 'react'
import type webpack from 'webpack'
import { StaticRouter, StaticRouterContext } from 'react-router'
import { HelmetProvider, FilledContext } from 'react-helmet-async'
import { ApolloProvider, ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { renderToStringWithData } from '@apollo/client/react/ssr'
import { SchemaLink } from '@apollo/client/link/schema'
import { onError } from '@apollo/client/link/error'
import Html from './Html'
import schema from './schema'

type Assets = {
  styles: string[]
  scripts: string[]
}

const { APP_BASE, NODE_ENV } = process.env

const getApp = (): React.FC => {
  if (NODE_ENV === 'production') return require('./client/Layout').default // eslint-disable-line
  const importFresh = require('import-fresh') // eslint-disable-line
  return importFresh('./client/Layout').default // eslint-disable-line
}

const getAssets = (ctx: Koa.Context): Assets => {
  const list: string[] = Object.values(
    process.env.NODE_ENV === 'production'
      ? ctx.state.manifest
      : (ctx.state.webpackStats as webpack.Stats).toJson().assetsByChunkName?.main,
  )
  return list.reduce((p: Assets, x) => {
    if (x.endsWith('.css')) {
      p.styles.push(x)
    } else if (x.endsWith('.js')) {
      p.scripts.push(x)
    }
    return p
  }, { styles: [], scripts: [] })
}

const SSR: Koa.Middleware = async ctx => {
  const { styles, scripts } = getAssets(ctx)
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ networkError, graphQLErrors }) => {
        if (graphQLErrors) console.error(...graphQLErrors)
        if (networkError) console.error(networkError)
      }),
      new SchemaLink({ schema }),
    ]),
  })
  const routerCtx: StaticRouterContext = {}
  const helmetCtx = {}

  const Layout = getApp()
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter basename={APP_BASE} location={ctx.url} context={routerCtx}>
        <HelmetProvider context={helmetCtx}>
          <Layout />
        </HelmetProvider>
      </StaticRouter>
    </ApolloProvider>
  )

  const html = await renderToStringWithData(App)
  const { helmet } = helmetCtx as FilledContext
  const data = client.extract()

  if (routerCtx.statusCode) ctx.status = routerCtx.statusCode
  if (routerCtx.url) {
    ctx.redirect(routerCtx.statusCode ?? 307, routerCtx.url)
    return
  }

  ctx.body = Html({
    data,
    helmet,
    html,
    styles,
    scripts,
  })
}
export default SSR
