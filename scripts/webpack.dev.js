const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.common.js');
const paths = require('./paths');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackHotDevClient = require.resolve('react-dev-utils/webpackHotDevClient');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // This is an alternative client for WebpackDevServer that shows a syntax error overlay.
    webpackHotDevClient
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new BundleAnalyzerPlugin()
  ]
});
