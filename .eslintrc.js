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
  },
}
