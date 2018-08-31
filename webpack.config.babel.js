/* eslint-disable import/no-extraneous-dependencies,global-require */

import path from 'path'
import { DefinePlugin } from 'webpack'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackAssetsManifest from 'webpack-assets-manifest'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'
import {
  appBase, appMountId, nodeEnv, devMode, outputDir, publicDir,
} from './config'

const constants = {
  __MOUNT: JSON.stringify(appMountId),
  __APPBASE: JSON.stringify(devMode ? '/' : appBase),
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
    path: publicDir,
  },
  module: {
    rules,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: 'src/client/html.ejs',
    //   inject: false,
    //   title: appTitle,
    //   appMountId: appMountId,
    //   mobile: true,
    // }),
    new DefinePlugin(constants),
    new WebpackAssetsManifest({
      // https://github.com/webdeveric/webpack-assets-manifest/#readme
      output: path.join(outputDir, './manifest.json'),
      writeToDisk: true,
    }),
  ],
  stats,
}

const serverConfig = {
  mode: nodeEnv,
  entry: { index: './src/server/index' },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: outputDir,
  },
  module: {
    rules,
  },
  plugins: [
    new DefinePlugin({ ...constants, __BROWSER: false }),
  ],
  stats,
}

if (! devMode) {
  clientConfig.plugins.push(new MiniCssExtractPlugin())
}

export default devMode ? clientConfig : [clientConfig, serverConfig]
