/* eslint-disable import/no-extraneous-dependencies */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
      'eslint-loader',
    ],
  },
  {
    test: /\.[sc]ss$/,
    exclude: /node_modules/,
    use: [
      'css-loader?modules',
      'postcss-loader',
    ],
  },
  {
    test: /css$/,
    use: [
      'css-loader',
    ],
  },
]

const plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    inject: false,
    title: '[insert title]',
    appMountId: 'main',
    mobile: true,
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
    rules,
  },
  plugins,
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    stats,
  },
  stats,
}
