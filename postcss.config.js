module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-cssnext': {},
  },
  env: {
    production: {
      cssnano: { autoprefixer: false },
    },
  },
}
