'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const fs = require('fs');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const {
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');

const config = require('./webpack.dev');
const webpackDevServerConfig = require('./webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);

const port = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const urls = prepareUrls(protocol, HOST, port);

const appName = require(paths.appPackageJson).name;
const compiler = createCompiler({
  appName,
  config,
  urls,
  useYarn,
  webpack,
});
const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);

devServer.listen(port, HOST, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Starting the development server...\n');
  openBrowser(urls.localUrlForBrowser);
});
