/* eslint-disable
  react/no-danger,
  react/jsx-props-no-spreading,
  @typescript-eslint/no-unsafe-member-access */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const { NODE_ENV, APP_BASE, MOUNT } = process.env

export default function Html({
  data,
  html,
  helmet,
  styles,
  scripts,
}: {
  data: any
  helmet: any
  html: string
  styles: string[]
  scripts: string[]
}): string {
  return `<!doctype html>${renderToStaticMarkup(
    <html lang="en" {...helmet.htmlAttributes.toComponent()}>
      <head>
        {helmet.title.toComponent()}
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Language" content="en" />
        {helmet.meta.toComponent()}
        {helmet.style.toComponent()}
        {helmet.link.toComponent()}
        {helmet.noscript.toComponent()}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        {styles.map(p => (
          <link key={p} rel="stylesheet" type="text/css" href={`${APP_BASE}/${p}`} />
        ))}
      </head>
      <body {...helmet.bodyAttributes.toComponent()}>
        <div id={MOUNT} dangerouslySetInnerHTML={{ __html: html }} />
        {data && (
          <script
            id="initData"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data, null, NODE_ENV === 'development' ? 2 : undefined),
            }}
          />
        )}
        {helmet.script.toComponent()}
        {scripts.map(p => (
          <script key={p} defer type="text/javascript" src={`${APP_BASE}/${p}`} />
        ))}
      </body>
    </html>,
  )}`
}
