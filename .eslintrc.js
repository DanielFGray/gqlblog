const R = require('ramda')
const config = require('./config')
const globals = R.pipe(
    Object.keys,
    R.map(k => [`__${k.toUpperCase()}`, false]),
    R.fromPairs,
    R.assoc('__non_webpack_require__', false),
  )(config)
console.log({ globals })

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
  ],
  env: {
    browser: true,
  },
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2, { flatTernaryExpressions: true  }],
    'no-unexpected-multiline': 'error',
    'no-nested-ternary': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'space-unary-ops': ['error', {
      overrides: {
        '!': true,
      },
    }],
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_$',
    }],
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
  },
  globals,
}
