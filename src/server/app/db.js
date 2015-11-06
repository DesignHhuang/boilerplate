'use strict';

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');
var obj = require('obj-tools');
var mongoose = require('mongoose');

//Mongoose extend just needs to be loaded
require('mongoose-schema-extend');

//Add string to object ID method
String.prototype.toObjectId = function() {
  return new mongoose.Types.ObjectId(this.toString());
};

/**
 * Application dependencies
 */
var config = require('app/config.js');
var globber = require('app/shared/utility/globber.js');
var dbErrorHandler = require('app/error/handlers/db.js');

/**
 * Export
 */
module.exports = function(app, options) {

  //Options given?
  options = obj.extend(config.db, options || {});

  //Set debugging on or off
  mongoose.set('debug', options.debug);

  //Connect to database
  console.log('Connecting to database', chalk.magenta(options.uri), '...');
  var db = mongoose.connect(options.uri, options.options);

  //Handle connection events
  mongoose.connection.on('error', dbErrorHandler);
  mongoose.connection.on('connected', function() {
    console.log(chalk.green('Database connected @'), chalk.magenta(options.uri));
  });

  //Loading within app?
  if (app) {

    //Load models
    console.log('Loading model files...');
    globber.files('./server/app/**/*.model.js').forEach(function(modelPath) {
      console.log(chalk.grey(' - %s'), modelPath.replace('./server/app/', ''));
      require(path.resolve(modelPath));
    });

    //Append to app
    app.db = db;
  }

  //Return the database instance
  return db;
};
