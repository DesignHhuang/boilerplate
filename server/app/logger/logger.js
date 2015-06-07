'use strict';

/**
 * Module dependencies
 */
var fs = require('fs');
var config = require('config/config');

/**
 * Module export
 */
module.exports = {

  /**
   * Get log format
   */
	getLogFormat: function() {
		return config.log.format;
	},

  /**
   * Get log options
   */
	getLogOptions: function() {
		var options = {};
		try {
			if (config.log.options.stream) {
				options = {
					stream: fs.createWriteStream(process.cwd() + '/' + config.log.options.stream, {flags: 'a'})
				};
			}
		}
    catch (e) {
			options = {};
		}
		return options;
	}
};
