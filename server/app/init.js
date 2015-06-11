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

	//Log an empty line
	console.log();

  //Try to find the environment file
	var envFiles = glob.sync('server/env/' + process.env.NODE_ENV + '.js');

  //If not found, check if NODE_ENV is set
	if (!envFiles.length) {
		if (process.env.NODE_ENV) {
			console.warn(chalk.yellow('No config file found for %s environment.'), process.env.NODE_ENV);
			console.warn(chalk.yellow('Using default development environment instead.'));
		}
    else {
			console.warn(chalk.yellow('NODE_ENV not defined. Using default development environment.'));
			console.info(chalk.grey('To set your NODE_ENV, add "export NODE_ENV=development" to your bash profile.'));
		}

    //Set development environment
		process.env.NODE_ENV = 'development';
	}
};
