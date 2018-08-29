/* eslint-disable import/no-extraneous-dependencies,global-require */

const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const config = require('./config.js')

const nodeEnv = process.env.NODE_ENV || 'development'
const devMode = nodeEnv.startsWith('dev')
const { appMountId } = config

const appBase = devMode ? '/' : config.appBase

const constants = {
  __MOUNT: JSON.stringify(appMountId),
  __APPBASE: JSON.stringify(appBase),
  __DEV: devMode,
  __BROWSER: true,
}

const rules = [
  {
    test: /node_modules[\\/].*\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  },
  {
    exclude: /node_modules/,
    test: /\.(s|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
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
    filename: devMode ? '[name].js' : '[name].[hash].js',
    path: config.publicDir,
  },
  module: {
    rules,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: 'src/client/html.ejs',
    //   inject: false,
    //   title: config.appTitle,
    //   appMountId,
    //   mobile: true,
    // }),
    new DefinePlugin(constants),
    new WebpackAssetsManifest({
      // https://github.com/webdeveric/webpack-assets-manifest/#readme
      output: '../manifest.json',
    }),
  ],
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
  plugins: [
    new DefinePlugin({ ...constants, __BROWSER: false }),
  ],
  stats,
}

module.exports = devMode ? clientConfig : [clientConfig, serverConfig]
