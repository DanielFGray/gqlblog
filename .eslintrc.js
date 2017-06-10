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
    'no-nested-ternary': 'off',
    'space-unary-ops': ['error', {
      words: true,
      nonwords: false,
      overrides: {
        '!': true,
      },
    }],
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_$',
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
    }],
    'arrow-parens': ['error', 'as-needed'],
    'react/prop-types': ['warn', {
      ignore: [],
      customValidators: [],
      skipUndeclared: false,
    }],
    'react/forbid-prop-types': ['warn', {
      forbid: [
        'any',
        'array',
        'object',
      ],
    }],
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
