# react-starter
My "boilerplate" for new React projects

## Features
the usual hipster stack

* Component based UI with [React][react]
* Routing via [React-Router][rr]
* Bundling with [Webpack][webpack]
  * separate JS vendor bundle
  * module resolution to `src` dir (instead of using relative paths)
* Transpiling with [Babel][babel] with ES2015 and Stage-0 presets
  * linting with [eslint][eslint] and the [Airbnb config][airbnb]
    * [semicolons][semi1] [are][semi2] [disabled][semi3]
* Type-checking with [flow][flow]
* clean extensible CSS with [PostCSS][postcss], [cssnext][cssnext], and [SugarSS][sugarss]
  * also includes [postcss-nested][nested]
  * linting with [stylelint][stylint] and [stylelint-config-standard][stylconf]

[react]: https://reactjs.org
[rr]: https://reacttraining.com/react-router/web/
[webpack]: https://webpack.js.org
[babel]: https://babeljs.io
[eslint]: http://eslint.org/
[airbnb]: https://github.com/airbnb/javascript
[semi1]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[semi2]: http://inimino.org/~inimino/blog/javascript_semicolons
[semi3]: https://www.youtube.com/watch?v=gsfbh17Ax9I
[flow]: https://flow.org/
[postcss]: http://postcss.org
[cssnext]: https://cssnext.io
[sugarss]: https://github.com/postcss/sugarss
[nested]: https://github.com/postcss/postcss-nested
[stylint]: https://stylelint.io
[stylconf]: https://github.com/stylelint/stylelint-config-standard

## Roadmap
* source maps
* separate CSS vendor bundle
* hot module reloading
* state management
  * via redux-observable or mobx
