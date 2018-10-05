/* eslint react/no-danger: off */
import * as React from 'react'
import { endsWith } from 'ramda'
import { partition } from './utils'

const manifest = __non_webpack_require__('./manifest.json')

const [styles, scripts] = partition([
  endsWith('.css'),
  endsWith('.js'),
], Object.values(manifest))

const Html = ({
  data,
  html,
  helmet,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        httpEquiv="x-ua-compatible"
        content="ie=edge,chrome=1"
      />
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
      />
      {helmet.link.toComponent()}
      {styles.map(css => (
        <link
          key={css}
          rel="stylesheet"
          type="text/css"
          href={`${__appBase}/${css}`}
        />
      ))}
    </head>
    <body>
      <div
        id={__mount}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
      {data && (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `window.__INIT_DATA = ${JSON.stringify(data)}`,
          }}
        />
      )}
      {scripts.map(js => (
        <script
          key={js}
          type="text/javascript"
          src={`${__appBase}/${js}`}
        />
      ))}
    </body>
  </html>
)

export default Html
