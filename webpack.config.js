const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')

const postcssConfig = require('./postcss.config')
const ROOT_DIR = path.resolve(__dirname)
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args)
const BUILD_DIR = resolvePath('build')
const SRC_DIR = resolvePath('src')

const isDebug = process.env.NODE_ENV !== 'production'

module.exports = {
  name: 'client',
  cache: isDebug,
  devtool: isDebug ? 'inline-cheap-module-source-map' : false,
  entry: {
    client: [
      './src/index',
    ],
  },
  mode: isDebug ? 'development' : 'production',
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: ExtractCssChunks.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: postcssConfig,
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  output: {
    path: resolvePath(BUILD_DIR, 'public'),
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new ExtractCssChunks(
      {
        filename: isDebug ? '[name].css' : '[name].[chunkhash:8].css',
        orderWarning: true,
      },
    ),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
  target: ['web', 'es5'],
  devServer: {
    historyApiFallback: true,
    contentBase: resolvePath(BUILD_DIR, 'public'),
    compress: true,
    port: 3001,
    open: true,
  },
}
