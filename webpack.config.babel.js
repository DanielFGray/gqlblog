/* eslint-disable import/no-extraneous-dependencies */

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const babelOpts = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    'babel-loader',
    'eslint-loader',
  ],
}

const cssOpts = {
  test: /\.[sc]ss$/,
  exclude: /node_modules/,
  use: ExtractTextPlugin.extract({
    use: [
      'css-loader?modules',
      'postcss-loader',
    ],
  }),
}

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module =>
      module.context && module.context.indexOf('node_modules') !== -1,
  }),
  new ExtractTextPlugin({
    filename: '[name].bundle.css',
    allChunks: true,
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    inject: false,
    title: 'title',
    appMountId: 'main',
    devServer: '',
  }),
]

const stats = {
  chunks: false,
  modules: false,
  children: false,
}

module.exports = {
  entry: './src/index',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      babelOpts,
      cssOpts,
    ],
  },
  plugins,
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    stats,
  },
  stats,
}
