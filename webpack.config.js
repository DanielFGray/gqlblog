/* eslint-disable import/no-extraneous-dependencies,global-require */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const config = require('./config.js')

const nodeEnv = process.env.NODE_ENV || 'development'
const devMode = nodeEnv.startsWith('dev')
const appMountId = 'root'

const appBase = devMode ? '/' : config.appBase

const constants = {
  __MOUNT: JSON.stringify(appMountId),
  __APPBASE: JSON.stringify(appBase),
  __DEV: devMode,
}

const rules = [
  {
    test: /node_modules[\\/].*\.css$/,
    use: [
      devMode
        ? 'style-loader'
        : MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  },
  {
    exclude: /node_modules/,
    test: /\.(s|c)ss$/,
    use: [
      devMode
        ? 'style-loader'
        : MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
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
]

const plugins = [
  new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[hash].css',
  }),
  new HtmlWebpackPlugin({
    template: 'src/client/html.ejs',
    inject: false,
    title: '[insert title]',
    appMountId: 'root',
    mobile: true,
  }),
  new DefinePlugin(constants),
]

const stats = {
  chunks: false,
  modules: false,
  colors: true,
}

const clientConfig = {
  mode: nodeEnv,
  entry: { main: './src/client/index' },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].[hash].js',
    path: config.publicDir,
  },
  module: {
    rules,
  },
  plugins,
  stats,
}

const serverConfig = {
  mode: nodeEnv,
  entry: { server: './src/server/index' },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: config.outputDir,
  },
  module: {
    rules,
  },
  stats,
}

module.exports = [clientConfig, serverConfig]
