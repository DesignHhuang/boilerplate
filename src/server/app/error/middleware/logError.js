'use strict';

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {

  //Log stack or error name and message
  if (err.stack) {
    console.error(chalk.red(err.stack));
  }
  else {
    console.error(chalk.red(err.name + (err.message ? ':' : ''), err.message));
  }

  //Validation error data
  if (err.name === 'ValidationError') {
    if (err.data && err.data.fields) {
      for (var field in err.data.fields) {
        if (err.data.fields.hasOwnProperty(field)) {
          console.error(chalk.red('  - ', err.data.fields[field].message));
        }
      }
    }
  }

  //Proceed to next middleware
  next(err);
};
