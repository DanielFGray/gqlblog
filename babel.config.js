module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: true,
      },
      loose: true,
      useBuiltIns: 'usage',
      corejs: 3,
    }],
    ['@babel/preset-typescript', {
      allExtensions: true,
      isTSX: true,
    }],
    '@babel/preset-react',
  ],
  plugins: [
    ['import-graphql', { extensions: ['.gql'] }],
    // ['babel-plugin-graphql-tag'],
    // ['@babel/plugin-proposal-class-properties', { loose: true }],
    // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    // '@babel/plugin-proposal-throw-expressions',
    // '@babel/plugin-proposal-do-expressions',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
  env: {
    production: {
      plugins: [
        'ramda',
      ],
    },
  },
}
