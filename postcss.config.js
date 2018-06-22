module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: '> 5%',
    },
    'postcss-inherit': {},
    'postcss-css-variables': {},
  },
  env: {
    production: {
      cssnano: { autoprefixer: false },
    },
  },
}
