'use strict';

/**
 * Add server folder to path
 */
require('app-module-path').addPath(__dirname);

/**
 * Module dependencies
 */
var init = require('config/init')();
var config = require('config/config');
var mongoose = require('mongoose');
var chalk = require('chalk');

/**
 * Connect to database
 */
var db = mongoose.connect(config.db.uri, config.db.options);
mongoose.connection.on('error', function(err) {
 	console.error(chalk.red('MongoDB connection error: ' + err));
 	process.exit(-1);
});

/**
 * Initialize express application
 */
var app = require('./app/app')(db);
var server = app.listen(config.server.port, function() {

  //Get vars
  var host = server.address().address;
  var port = server.address().port;
  var protocol = (process.env.NODE_ENV === 'secure') ? 'https://' : 'http://';

  //Fix host
  if (host === '::') {
    host = 'localhost';
  }

  //Log
  console.log(chalk.green('Application ' + config.app.name + ' started (' + process.env.NODE_ENV + ')'));
  console.log(chalk.green('================================================='));
  console.log(chalk.green('Web server:\t' + protocol + host + ':' + port));
  console.log(chalk.green('Database:\t' + config.db.uri));
});

/**
 * Expose app
 */
exports = module.exports = app;
