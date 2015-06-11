'use strict';

/**
 * Module dependencies
 */
var fs = require('fs');
var _ = require('lodash');

/**
 * Resolve environment configuration
 */
var resolveConfig = function() {

  //Merge config of all environments with config for current environment
	var config = _.merge(
		require('env/all'),
		require('env/' + process.env.NODE_ENV) || {}
	);

  //Merge in local environment config if file exists
	return _.merge(config, (fs.existsSync('env/local.js') && require('env/local.js')) || {});
};

/**
 * Load app configurations
 */
module.exports = resolveConfig();
