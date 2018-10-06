import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { fromPairs } from 'ramda'
import Html from './Html'
import Routes from './client/Routes'
import Layout from './client/Layout'
import { getPromisesFromTree } from './getDataFromTree'
import { Provider } from './createContext'

export default ({ appBase }) => async ctx => {
  const routerCtx = {}
  const helmetCtx = {}
  const App = fetchData => (
    <Provider value={fetchData}>
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
    const data = await Promise.all(
      getPromisesFromTree({ rootElement: App() })
        .map(({ promise, instance }) => Promise.all([`${instance.props.url}`, promise()
          .then(({ status, body }) => {
            if (status === 'ok') return body
            throw new Error(`${status}: ${JSON.stringify(body)}`)
          })
        ])),
    ).then(fromPairs)
    const html = renderToString(App(data))
    const { helmet } = helmetCtx
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
