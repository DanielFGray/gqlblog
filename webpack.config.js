/* eslint-disable import/no-extraneous-dependencies */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const outPath = path.resolve(__dirname, 'public')

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
    enforce: 'pre',
    use: [
      {
        loader: 'eslint-loader',
        options: {
          cache: true,
          failOnError: false,
        },
      },
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
]

if (devMode) {
  // const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin') // eslint-disable-line global-require
  // plugins.push(new FriendlyErrorsWebpackPlugin())
}

const stats = {
  chunks: false,
  modules: false,
  colors: true,
}

const clientConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: { main: './src/client/index' },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].[hash].js',
    path: outPath,
  },
  module: {
    rules,
  },
  plugins,
  stats,
}

if (devMode) {
  const webpackServeWaitpage = require('webpack-serve-waitpage')
  clientConfig.serve = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    devMiddleware: {
      stats,
    },
    add(app, middleware, options) {
      app.use(webpackServeWaitpage(options))
    },
  }
}

module.exports = [clientConfig]
