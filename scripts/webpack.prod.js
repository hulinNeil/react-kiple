const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.common.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'none',
  bail: true,
  plugins: [
    // Extract CSS
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      ignoreOrder: true
    }),
    // Compress CSS
    new OptimizeCSSAssetsPlugin(),
    new CleanWebpackPlugin(),
  ],
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512 * 1024,
    maxAssetSize: 1024 * 1024,
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    }
  }
});
