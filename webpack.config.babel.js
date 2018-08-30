/* eslint-disable import/no-extraneous-dependencies,global-require */

import { DefinePlugin } from 'webpack'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'
import * as config from './config.js'

const { nodeEnv, devMode } = config
const appBase = devMode ? '/' : config.appBase

const constants = {
  __MOUNT: JSON.stringify(config.appMountId),
  __APPBASE: JSON.stringify(appBase),
  __DEV: devMode,
  __BROWSER: true,
}

const rules = [
  {
    test: /node_modules[\\/].*\.css$/,
    use: [
      devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  },
  {
    exclude: /node_modules/,
    test: /\.(s|c)ss$/,
    use: [
      devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
    //   appMountId: config.appMountId,
    //   mobile: true,
    // }),
    new DefinePlugin(constants),
    new WebpackAssetsManifest({
      // https://github.com/webdeveric/webpack-assets-manifest/#readme
      output: './manifest.json',
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

export default devMode ? clientConfig : [clientConfig, serverConfig]
