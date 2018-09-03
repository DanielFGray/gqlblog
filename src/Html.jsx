/* global __APPBASE:false __MOUNT:false */
/* eslint react/no-danger: off */
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

const appBase = __APPBASE === '/' ? '' : __APPBASE

const Html = ({
  styles = [],
  scripts = [],
  data,
  children,
}) => {
  const html = renderToString(children)
  const helmet = Helmet.rewind()

  return renderToStaticMarkup(
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
            href={`${appBase}/${css}`}
          />
        ))}
      </head>
      <body>
        <div
          id={__MOUNT}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INIT_DATA = ${JSON.stringify(data)}`,
          }}
        />
        {scripts.map(js => (
          <script
            key={js}
            src={`${appBase}/${js}`}
          />
        ))}
      </body>
    </html>,
  )
}


export default Html
