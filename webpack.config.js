/* eslint-disable
  @typescript-eslint/no-var-requires,
  import/no-extraneous-dependencies,
  global-require */

require('dotenv').config()
const path = require('path')
const { DefinePlugin } = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const { NODE_ENV, PUBLIC_DIR, OUTPUT_DIR, APP_TITLE, APP_BASE, APP_URL, MOUNT } = process.env

const devMode = NODE_ENV === 'development'

/** @typedef {import('webpack').RuleSetRule} WebpackRules */
/** @type WebpackRules[] */
const cssLoaders = [
  {
    test: /\.css$/,
    include: /node_modules/,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
  },
]

/** @type WebpackRules[] */
const babelLoader = [
  {
    test: /\.(gql|[tj]sx?)$/,
    exclude: /node_modules/,
    use: 'babel-loader',
  },
]

const stats = {
  chunks: false,
  modules: false,
  colors: true,
}

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.gql']

/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @type WebpackConfig */
const clientConfig = {
  name: 'client',
  mode: NODE_ENV,
  entry: ['./src/client/index'],
  resolve: {
    extensions,
  },
  output: {
    path: path.resolve(PUBLIC_DIR),
    publicPath: '/',
    filename: devMode ? '[name].js' : '[name]-[hash].js',
    chunkFilename: devMode ? '[name].js' : '[id]-[chunkhash].js',
  },
  module: {
    rules: [...babelLoader, ...cssLoaders],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name]-[hash].css',
      chunkFilename: devMode ? '[name].css' : '[id]-[chunkhash].css',
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        APP_BASE: JSON.stringify(APP_BASE),
        APP_URL: JSON.stringify(APP_URL),
        APP_TITLE: JSON.stringify(APP_TITLE),
        MOUNT: JSON.stringify(MOUNT),
      },
    }),
    new WebpackAssetsManifest({
      // https://github.com/webdeveric/webpack-assets-manifest/#readme
      output: path.join(path.resolve(OUTPUT_DIR), 'manifest.json'),
      writeToDisk: true,
    }),
  ],
  stats,
}

/** @type WebpackConfig */
const serverConfig = {
  name: 'server',
  mode: NODE_ENV,
  entry: { index: './src/index' },
  devtool: 'source-map',
  target: 'async-node',
  externals: [/manifest\.json$/, nodeExternals()],
  resolve: {
    extensions,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(OUTPUT_DIR),
  },
  module: {
    rules: babelLoader,
  },
  stats,
  plugins: [],
}

module.exports = [clientConfig, serverConfig]
