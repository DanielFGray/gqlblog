# react-starter
My "boilerplate" for new React projects

## Features

* Component based UI with [React][react]
* Bundling with [Webpack][webpack]
  * separate JS vendor bundle
* Transpiling with [Babel][babel] with ES2015 and Stage-0 presets
  * linting with [eslint][eslint] and the [Airbnb config][airbnb]
    * [semicolons][semi1] [are][semi2] [disabled][semi3]
    * auto-formatting with [Prettier][prettier]
* Type-checking with [flow][flow]
* clean extensible CSS with [PostCSS][postcss], [cssnext][cssnext], and [SugarSS][sugarss]
  * linting with [stylelint][stylint] and [stylelint-config-standard][stylconf]
  * also includes:
    * [postcss-nested][nested] for cleaner nesting
    * [css-variables][cssvars] for selector-local variables
    * [inherit][cssinherit] for selector composition

[react]: https://reactjs.org
[webpack]: https://webpack.js.org
[babel]: https://babeljs.io
[eslint]: http://eslint.org/
[airbnb]: https://github.com/airbnb/javascript
[semi1]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[semi2]: http://inimino.org/~inimino/blog/javascript_semicolons
[semi3]: https://www.youtube.com/watch?v=gsfbh17Ax9I
[prettier]: https://prettier.io/
[flow]: https://flow.org/
[postcss]: http://postcss.org
[cssnext]: https://cssnext.io
[sugarss]: https://github.com/postcss/sugarss
[nested]: https://github.com/postcss/postcss-nested
[cssinherit]: https://github.com/GarthDB/postcss-inherit
[cssvars]: https://github.com/MadLittleMods/postcss-css-variables
[stylint]: https://stylelint.io
[stylconf]: https://github.com/stylelint/stylelint-config-standard

## Roadmap
* source maps
* hot module reloading
