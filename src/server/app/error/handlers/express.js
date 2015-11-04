'use strict';

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Application dependencies
 */
var config = require('app/config.js');

/**
 * Error handlers
 */
module.exports = function(err) {
  if (err.errno === 'EADDRINUSE') {
    console.error(chalk.red('Web server port %s is already in use'), config.server.port);
  }
  else {
    console.error(chalk.red('Web server error:'));
    console.error(chalk.red(err));
  }
  process.exit(-1);
};
