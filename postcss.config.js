/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = ({ env }) => ({
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': { stage: 0 },
    'postcss-fixes': { preset: 'recommended' },
    'postcss-advanced-variables': {},
    'postcss-nested': {},
    'cssnano': env !== 'production' ? false : {
      autoprefixer: false,
      safe: true,
      calc: false,
    },
  },
})
