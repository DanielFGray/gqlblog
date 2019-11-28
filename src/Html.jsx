/* eslint react/no-danger: off */
import React from 'react'

export default function Html({ data, html, helmet, styles, scripts, appBase }) {
  return (
    <html lang="en" {...helmet.htmlAttributes.toString()}>
      <head>
        {helmet.title.toComponent()}
        <meta httpEquiv="Content-Language" content="en" />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        {helmet.meta.toComponent()}
        {helmet.style.toComponent()}
        {helmet.link.toComponent()}
        {helmet.noscript.toComponent()}
        {helmet.link.toComponent()}
        {styles && styles.map(link => (
          <link
            key={link}
            rel="stylesheet"
            type="text/css"
            href={`${appBase}/${link}`}
          />
        ))}
      </head>
      <body {...helmet.bodyAttributes.toComponent()}>
        <div
          id={process.env.MOUNT}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
        {data && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: Object.entries(data)
                .reduce((p, [k, v]) => p.concat(`window[${JSON.stringify(k)}]=\`${JSON.stringify(v)}\`;`), ''),
            }}
          />
        )}
        {helmet.script.toComponent()}
        {scripts && scripts.map(js => (
          <script
            key={js}
            defer
            type="text/javascript"
            src={`${appBase}/${js}`}
          />
        ))}
      </body>
    </html>
  )
}
