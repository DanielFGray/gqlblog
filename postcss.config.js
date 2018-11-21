/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-preset-env')({ stage: 0 }),
    require('postcss-fixes')({ preset: 'recommended' }),
    require('postcss-advanced-variables')(),
    require('postcss-extend-rule')(),
    require('postcss-property-lookup')(),
  ],
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
