'use strict';

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Error handlers
 */
module.exports = function(err) {
  console.error(chalk.red('Database error:'));
  console.error(chalk.red(err.stack ? err.stack : err));
  process.exit(-1);
};
