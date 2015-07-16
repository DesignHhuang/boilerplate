'use strict';

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Application dependencies
 */
var config = require('app/config');

/**
 * Error handlers
 */
module.exports = {

  /**
   * Database errors
   */
  db: function(error) {
    console.error(chalk.red('Database error:'));
    console.error(chalk.red(error));
    process.exit(-1);
  },

  /**
   * Express server errors
   */
  express: function(error) {
    if (error.errno === 'EADDRINUSE') {
      console.error(chalk.red('Web server port %s is already in use'), config.server.port);
    }
    else {
      console.error(chalk.red('Web server error:'));
      console.error(chalk.red(error));
    }
    process.exit(-1);
  }
};
