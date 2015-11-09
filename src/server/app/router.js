'use strict';

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');
var express = require('express');

/**
 * Application dependencies
 */
var config = require('app/config.js');
var globber = require('app/shared/utility/globber.js');

/**
 * Export
 */
module.exports = function(app) {

  //Create API sub router
  var api = express.Router();

  //Load API routes
  console.log('Loading API routes...');
  globber.files('./server/app/**/*.routes.js').forEach(function(routePath) {
    console.log(chalk.grey(' - %s'), routePath.replace('./server/app/', ''));
    require(path.resolve(routePath))(api);
  });

  //Use the API router
  app.use(config.client.api.baseUrl, api);

  //Send all other GET requests to Angular
  app.get('/*', function(req, res) {
    res.sendFile(path.resolve('./public/index.html'));
  });
};
