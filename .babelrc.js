module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions']
      },
      loose: true,
      modules: false
    }],
    '@babel/preset-flow',
    '@babel/preset-react'
  ],
  plugins: [
    ['lodash', { id: ['lodash', 'ramda', 'recompose'] }],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    // '@babel/plugin-proposal-do-expressions',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // '@babel/plugin-proposal-function-sent',
    // '@babel/plugin-proposal-export-namespace-from',
    // '@babel/plugin-proposal-numeric-separator',
    // '@babel/plugin-proposal-throw-expressions',
    // '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-syntax-import-meta',
    // '@babel/plugin-proposal-json-strings'
  ]
}

