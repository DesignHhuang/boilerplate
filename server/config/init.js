'use strict';

/**
 * Module dependencies
 */
var glob = require('glob');
var chalk = require('chalk');

/**
 * Module export
 */
module.exports = function() {

  //Try to find the environment file
	var envFiles = glob.sync('server/env/' + process.env.NODE_ENV + '.js');

  //If not found, check if NODE_ENV is set
	if (!envFiles.length) {
		if (process.env.NODE_ENV) {
			console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment. Using default development environment instead.'));
		}
    else {
			console.error(chalk.red('NODE_ENV not defined. Using default development environment.'));
		}

    //Set development environment
		process.env.NODE_ENV = 'development';
	}
};
