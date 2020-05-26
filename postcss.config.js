/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': { stage: 0 },
    'postcss-fixes': { preset: 'recommended' },
    'postcss-advanced-variables': {},
    'postcss-nested': {},
  },
  env: {
    production: {
      cssnano: {
        autoprefixer: false,
        safe: true,
        calc: false,
      },
    },
  },
}
