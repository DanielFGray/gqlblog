import * as React from 'react'
import helmet from 'react-helmet'
import { partition, pipe } from 'ramda'
import Layout from '../client/Layout'
import config from '../../config'
import manifest from '../../dist/manifest.json'

const appBase = config.appBase.endsWith('/') ? config.appBase : `${config.appBase}/`
const { appMountId } = config

const [scripts, styles, unknown] = pipe(
  Object.values,
  partition(x => x.endsWith('js')),
  ([js, xs]) => [js, ...partition(x => x.endsWith('css'), xs)],
)(manifest)

if (unknown.length > 0) {
  console.log('unknown webpack assets!', unknown)
}

// eslint-disable-next-line react/prop-types
const Html = ({ data, children }) => (
  <html lang="en">
    <head>
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      {styles.map(s => <link key={s} rel="stylesheet" href={`${appBase}${s}`} type="text/css" />)}
    </head>
    <body>
      <div id={appMountId}>
        <Layout>
          {children}
        </Layout>
      </div>
      <script id="initialData" type="text/plain" data-json={JSON.stringify(data)} />
      {scripts.map(s => <script key={s} type="text/javascript" src={`${appBase}${s}`} />)}
    </body>
  </html>
)

export default Html
