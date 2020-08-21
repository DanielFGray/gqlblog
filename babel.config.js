module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
        loose: true,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [['import-graphql', { runtime: true }]],
  env: {
    production: {
      plugins: ['ramda'],
    },
  },
}
