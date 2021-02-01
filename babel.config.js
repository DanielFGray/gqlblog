module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
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
    ['import-graphql', { runtime: true }],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
}
