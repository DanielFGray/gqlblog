import Koa from 'koa'
import React from 'react'
import { renderToStringWithData } from '@apollo/react-ssr'
import { StaticRouter, StaticRouterContext } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { HelmetData } from 'react-helmet'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Layout from './client/Layout'
import Html from './Html'
import schema from './schema'

type Assets = {
  styles: string[];
  scripts: string[];
}

const { APP_BASE } = process.env

const getAssets = (ctx: Koa.Context): Assets => {
  const list: string[] = Object.values(
    process.env.NODE_ENV === 'production'
      ? ctx.state.manifest
      : ctx.state.webpackStats.toJson().assetsByChunkName.main,
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

export default async function SSR(ctx: Koa.Context) {
  const { styles, scripts } = getAssets(ctx)
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ networkError, graphQLErrors }) => {
        if (graphQLErrors) {
          console.error(...graphQLErrors)
        }
        if (networkError) {
          console.error(networkError)
        }
      }),
      new SchemaLink({ schema }),
    ]),
  })
  const routerCtx: StaticRouterContext = {}
  const helmetCtx = {}

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter
        basename={APP_BASE}
        location={ctx.url}
        context={routerCtx}
      >
        <HelmetProvider context={helmetCtx}>
          <Layout />
        </HelmetProvider>
      </StaticRouter>
    </ApolloProvider>
  )

  const html = await renderToStringWithData(App)
  const { helmet }: HelmetData = helmetCtx
  const data = { __INIT_DATA: client.extract() }

  if (routerCtx.statusCode) {
    ctx.status = routerCtx.statusCode
  }
  if (routerCtx.url) {
    ctx.redirect(routerCtx.url)
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
