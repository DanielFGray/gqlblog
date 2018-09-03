/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 1,
      browsers: 'last 2 versions',
    }),
  ],
  env: {
    production: {
      cssnano: { autoprefixer: true },
    },
  },
}
