'use strict';

/**
 * Module dependencies
 */
var fs = require('fs');
var _ = require('lodash');
var chalk = require('chalk');

/**
 * Helper to get specific environment config
 */
function getEnvConfig(env) {
	if (!env || !fs.existsSync('./env/' + env + '.js')) {
		if (env !== 'local') {
				console.warn(chalk.yellow('Config file for environment "%s" not found!'), env);
		}
		return {};
	}
	return require('./env/' + env) || {};
}

/**
 * Get combined config
 */
var getCombinedConfig = function() {

	//Detect environment and create config
	var env = require('./env');
	var config = _.merge(
		getEnvConfig('all'),
		getEnvConfig(env),
		getEnvConfig('local')
	);

	//Append environment
	config.app.env = env;
	return config;
};

/**
 * Load combined configuration
 */
module.exports = getCombinedConfig();
