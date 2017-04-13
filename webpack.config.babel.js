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
  ],
}

const cssOpts = {
  test: /\.[sc]ss$/,
  use: ExtractTextPlugin.extract({
    use: [
      'css-loader',
      'postcss-loader',
    ],
  }),
}

const pluginList = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module =>
      module.context && module.context.indexOf('node_modules') !== -1,
  }),
  new ExtractTextPlugin('styles.bundle.css'),
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    inject: false,
    title: 'title',
    appMountId: 'main',
    devServer: '',
  }),
]

if (process.env.NODE_ENV === 'production') {
  pluginList.push(
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false,
    }),
  )
}

module.exports = {
  entry: './src/index',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
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
  plugins: pluginList,
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  stats: {
    modules: false,
    children: false,
  },
}
