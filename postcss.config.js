module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-nested': {},
    'postcss-cssnext': {},
    cssnano: { autoprefixer: false },
  },
}
