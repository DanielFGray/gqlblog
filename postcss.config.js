module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-cssnext': {},
    'postcss-inherit': {},
    'postcss-css-variables': {},
  },
  env: {
    production: {
      cssnano: { autoprefixer: false },
    },
  },
}
