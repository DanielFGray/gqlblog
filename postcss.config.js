/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 1,
      browsers: 'last 2 versions',
    }),
    require('postcss-fixes')({ preset: 'recommended' }),
    require('postcss-nesting')(),
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
