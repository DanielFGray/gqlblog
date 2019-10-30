/* eslint-disable import/no-extraneous-dependencies,global-require */

const path = require('path')
const { DefinePlugin } = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')
// const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const config = require('./config.js')

const constants = Object.entries(config)
  .map(([k, v]) => [`__${k}`, JSON.stringify(v)])
  .reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {})

const cssLoaders = [
  {
    test: /\.css$/,
    include: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
]

const babelLoader = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
  {
    test: /\.g(raph)?ql$/,
    use: [
      {
        loader: 'webpack-graphql-loader',
        options: {
          // output: 'string',
          // minify: true,
          output: 'document', // FIXME
        },
      },
    ],
  },
]

const stats = {
  chunks: false,
  modules: false,
  colors: true,
}

const clientConfig = {
  name: 'client',
  mode: config.nodeEnv,
  entry: { main: './src/client/index' },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: config.publicDir,
    filename: config.devMode ? '[name].js' : '[name]-[hash].js',
    chunkFilename: config.devMode ? '[name].js' : '[id]-[chunkhash].js',
  },
  module: {
    rules: [
      ...babelLoader,
      ...cssLoaders,
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: config.devMode ? '[name].css' : '[name]-[hash].css',
      chunkFilename: config.devMode ? '[name].css' : '[id]-[chunkhash].css',
    }),
    new DefinePlugin({ ...constants, __browser: true }),
    new WebpackAssetsManifest({
      // https://github.com/webdeveric/webpack-assets-manifest/#readme
      output: path.join(config.outputDir, './manifest.json'),
      writeToDisk: true,
    }),
    ...(
      config.nodeEnv
        ? [new OptimizeCssAssetsPlugin()]
        : []
    ),
  ],
  stats,
}

const serverConfig = {
  name: 'server',
  mode: config.nodeEnv,
  entry: { index: './src/index' },
  target: 'node',
  externals: [
    /config\.js$/,
    /manifest\.json$/,
    nodeExternals(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: config.outputDir,
  },
  module: {
    rules: babelLoader,
  },
  plugins: [
    new DefinePlugin({ ...constants, __BROWSER: false }),
  ],
  stats,
}

module.exports = [clientConfig, serverConfig]
