'use strict';

/**
 * External dependencies
 */
var path = require('path');
var chalk = require('chalk');

/**
 * Application dependencies
 */
var passport = require('passport');
var globber = require('app/shared/utility/globber.js');

/**
 * Export
 */
module.exports = function(app) {

  //Passport initialization and strategies loading
  app.use(passport.initialize());

  //Load authentication strategies
  console.log('Loading authentication strategies...');
  globber.files('./server/app/auth/strategies/**/*.js').forEach(function(strategyPath) {
    console.log(chalk.grey(' - %s'), strategyPath.replace('./server/app/', ''));
    require(path.resolve(strategyPath))();
  });
};
