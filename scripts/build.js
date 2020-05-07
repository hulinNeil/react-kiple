'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

const fs = require('fs');
const paths = require('./paths');
const webpack = require('webpack');

const webpackConfig = require('./webpack.prod');
const chalk = require('react-dev-utils/chalk');

console.log('Creating an optimized production build...\n');

var compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  let messages;
  if (err) {
    console.log(chalk.red(err));
    process.exit(1);
    return;
  }
  const status = stats.toJson({ all: false, warnings: true, errors: true });
  if (status.errors.length || status.warnings.length) {
    console.log(chalk.red('Failed to compile.\n'));
    if (status.warnings.length) {
      console.log(chalk.red('You have some warnings should been fixed.\n'));
      status.warnings.forEach((item) =>
        console.log(chalk.yellow('WARNING: ' + item + '\n'))
      );
    }
    if (status.errors.length) {
      console.log(chalk.red('You have some error should been fixed.\n'));
      status.errors.forEach((item) =>
        console.log(chalk.red('ERROR: ' + item + '\n'))
      );
      process.exit(1);
    }
  }
  console.log(
    chalk.green(`Compiled successfully! Please check ${paths.appBuild}`)
  );
  console.log(
    chalk.green('You can run ') +
      chalk.underline.bgBlue(' yarn start:prod ') +
      chalk.green(' to show this app.')
  );
});
