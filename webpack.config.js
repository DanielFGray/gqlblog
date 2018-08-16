/* eslint-disable import/no-extraneous-dependencies,global-require */

const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const { safeLoad: yaml } = require('js-yaml')

const nodeEnv = process.env.NODE_ENV || 'development'
const devMode = nodeEnv.startsWith('dev')
const appMountId = 'root'

const config = yaml(fs.readFileSync('config.yaml', 'utf8'))
const outputDir = path.resolve(path.join(__dirname, config.outputDir))
const publicDir = path.join(outputDir, 'public')

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
  new DefinePlugin(constants),
]

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
    path: outputDir,
  },
  module: {
    rules,
  },
  plugins,
  stats,
}

const serverConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: { server: './src/server/index' },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: publicDir,
  },
  module: {
    rules,
  },
  stats,
}

if (devMode) {
  const webpackServeWaitpage = require('webpack-serve-waitpage')
  const history = require('connect-history-api-fallback')
  const convert = require('koa-connect')
  clientConfig.serve = {
    port: process.env.PORT || 8765,
    host: process.env.HOST || 'localhost',
    devMiddleware: {
      content: outputDir
      stats,
    },
    add(app, middleware, options) {
      app.use(convert(history({
        /* https://github.com/bripkens/connect-history-api-fallback#options */
      })))
      app.use(webpackServeWaitpage(options))
    },
  }
}

module.exports = [clientConfig, serverConfig]
