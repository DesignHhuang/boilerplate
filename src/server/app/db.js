'use strict';

/**
 * External dependencies
 */
var mongoose = require('mongoose');
var chalk = require('chalk');
var path = require('path');

/**
 * Application dependencies
 */
var config = require('app/config');
var errorHandler = require('app/error/handler');
var globber = require('common/utility/globber');

/**
 * Connect to database
 */
console.log('Connecting to database...');
var db = mongoose.connect(config.db.uri, config.db.options);

/**
 * Handle connection events
 */
mongoose.connection.on('error', errorHandler.db);
mongoose.connection.on('connected', function() {
  console.log(chalk.green('Database connected @'), chalk.grey(config.db.uri));
});

/**
 * Load model files
 */
console.log('Loading model files...');
globber.files('./**/*.model.js').forEach(function(modelPath) {
  console.log(' - %s', modelPath.replace('./server/', ''));
	require(path.resolve(modelPath));
});

/**
 * Export
 */
module.exports = db;
