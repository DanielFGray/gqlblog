import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import Html from './Html'
import Routes from './client/Routes'
import Layout from './client/Layout'
import { renderToStringWithData } from './getDataFromTree'
import { Provider } from './createContext'

export default ({ appBase, schema }) => async ctx => {
  const routerCtx = {}
  const helmetCtx = {}
  const app = props => (
    <Provider value={props}>
      <StaticRouter
        basename={appBase}
        location={ctx.url}
        context={routerCtx}
      >
        <HelmetProvider context={helmetCtx}>
          <Layout>
            <Routes />
          </Layout>
        </HelmetProvider>
      </StaticRouter>
    </Provider>
  )
  try {
    const { errors, data, html } = await renderToStringWithData({ app, schema })
    if (errors.length) {
      data.errors = errors
      console.error(errors)
    }
    if (routerCtx.status) {
      ctx.status = routerCtx.status
    }
    if (routerCtx.url) {
      ctx.redirect(routerCtx.url)
      return
    }
    const { helmet } = helmetCtx
    ctx.body = `<!doctype html>${renderToStaticMarkup(Html({ data, helmet, html }))}`
  } catch (e) {
    ctx.status = 500
    ctx.body = 'Error'
    console.error(e)
    process.exit(1)
  }
}
