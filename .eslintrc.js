const config = require('./config')

const globals = Object.entries(config)
  .map(([k]) => [`__${k}`, false])
  .reduce((p, [k, v]) => ({ ...p, [k]: v }), { '__non_webpack_require__': false })

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
  ],
  env: {
    browser: true,
  },
  globals,
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
}
