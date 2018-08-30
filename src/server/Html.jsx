import * as React from 'react'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { thread, partition } from '../utils'
import Layout from '../client/Layout'
import manifest from '../../dist/manifest.json'
import { appMountId, appBase as base } from '../../config'

const appBase = base.endsWith('/') ? base : `${base}/`

const [scripts, styles, unknown] = thread(
  manifest,
  Object.values,
  partition([
    x => x.endsWith('js'),
    x => x.endsWith('css'),
  ]),
)

if (unknown.length > 0) {
  console.log('unknown webpack assets!', unknown)
}

const Html = ({ data, children }) => {
  const app = (<div id={appMountId}><Layout>{children}</Layout></div>)
  const c = renderToString(app)
  const helmet = Helmet.renderStatic()
  return `<!doctype html>
<html lang="en">
  <head>
    ${helmet.title.toString()}
    <meta charSet="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${styles.map(s => `<link key="${s}" rel="stylesheet" href="${appBase}static/${s}" type="text/css" />`)}
  </head>
  <body>
    ${c}
    <script type="text/javascript">
      window.__INIT_DATA = ${JSON.stringify(data)}
    </script>
    ${scripts.map(s => `<script key=${s} type="text/javascript" src="${appBase}static/${s}"></script>`)}
  </body>
</html>`
}

export default Html
