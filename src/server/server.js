'use strict';

/**
 * Add server folder to path
 */
require('app-module-path').addPath(__dirname);

/**
 * External dependencies
 */
var chalk = require('chalk');

/**
 * Application dependencies
 */
var config = require('app/config');
var errorHandler = require('app/error/handler');

/**
 * Log
 */
console.log('Running application', chalk.grey(config.app.name),
  'in the', chalk.grey(process.env.NODE_ENV), 'environment');

/**
 * Initialize express application
 */
console.log('Starting Express server...');
var app = require('app/express')();
var server = app.listen(config.server.port, function() {

  //Determine address
  var host = this.address().address.replace('::', 'localhost');
  var port = this.address().port;
  var protocol = (process.env.NODE_ENV === 'secure') ? 'https://' : 'http://';

  //Remember in config and output success message
  config.server.address = protocol + host + ':' + port;
  console.log(chalk.green('Express server started @ '), chalk.grey(config.server.address));
});
server.on('error', errorHandler.server);

/**
 * Expose app
 */
module.exports = app;
