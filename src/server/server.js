'use strict';

/**
 * Add server folder to path
 */
require('app-module-path').addPath(__dirname);

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');

/**
 * Fix CWD if run from server path
 */
var cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'server') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Application dependencies
 */
var config = require('app/config.js');
var expressErrorHandler = require('app/error/handlers/express.js');

/**
 * Log
 */
console.log('Running application', chalk.magenta(config.client.app.name),
  'in the', chalk.magenta(process.env.NODE_ENV), 'environment');

/**
 * Initialize express application
 */
console.log('Starting Express server...');
var app = require('app/app')();
var server = app.listen(config.server.port, function() {

  //Skip this for Azure
  if (!this.address()) {
    return;
  }

  //Determine address
  var host = this.address().address.replace('::', 'localhost');
  var port = this.address().port;
  var protocol = (process.env.NODE_ENV === 'secure') ? 'https://' : 'http://';

  //Remember in config and output success message
  config.server.address = protocol + host + ':' + port;
  console.log(chalk.green('Express server started @ '), chalk.magenta(config.server.address));
});
server.on('error', expressErrorHandler);

/**
 * Expose app
 */
module.exports = app;
