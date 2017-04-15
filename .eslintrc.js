module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
  ],
  plugins: [
    'flowtype',
  ],
  env: {
    browser: true,
  },
  rules: {
    semi: [ 'error', 'never' ],
    'no-unexpected-multiline': 'error',
    'array-bracket-spacing': [ 'error', 'always' ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [ 'src' ],
      },
    },
  },
}
