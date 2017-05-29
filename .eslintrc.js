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
    semi: ['error', 'never'],
    'no-unexpected-multiline': 'error',
    'no-nested-ternary': 0,
    'space-unary-ops': [
      2, {
        words: true,
        nonwords: false,
        overrides: {
          '!': true,
        },
      },
    ],
    'no-unused-vars': [
      'error', {
        argsIgnorePattern: '^_$',
      },
    ],
    'react/sort-comp': ['error', {
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        '/^on.+$/',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'everything-else',
        '/^render.+$/',
        'render',
      ],
    }],
  },
}
