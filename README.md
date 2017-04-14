# react-starter
My "boilerplate" for new React projects

## Features
the usual hipster stack

* Component based UI with [React][1]
* Bundling with [Webpack][2]
  * Separate vendor bundle
  * module resolution to `src` dir (instead of using relative paths)
* Transpiling with [Babel][3] with ES2015 and Stage-0 presets
  * linting with [eslint][4] and the [Airbnb config][5]
    * [semicolons][6] [are][7] [disabled][8]
* Type-checking with [flow][9]
* clean extensible CSS with [PostCSS][10], [cssnext][11], and [SugarSS][12]
  * also includes [postcss-nested][13] for Stylus-like syntax
  * linting with [stylelint][14] and [stylelint-config-standard][15]

[1]: https://reactjs.org
[2]: https://webpack.js.org
[3]: https://babeljs.io
[4]: http://eslint.org/
[5]: https://github.com/airbnb/javascript
[6]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[7]: http://inimino.org/~inimino/blog/javascript_semicolons
[8]: https://www.youtube.com/watch?v=gsfbh17Ax9I
[9]: https://flow.org/
[10]: http://postcss.org
[11]: https://cssnext.io
[12]: https://github.com/postcss/sugarss
[13]: https://github.com/postcss/postcss-nested
[14]: https://stylelint.io
[15]: https://github.com/stylelint/stylelint-config-standard

## Roadmap
* source maps
* separate CSS vendor bundle
* hot module reloading
* state management
  * via redux-observable or mobx
