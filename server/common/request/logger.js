
/**
 * External dependencies
 */
var fileStreamRotator = require('file-stream-rotator');
var path = require('path');
var fs = require('fs');

/**
 * Application dependencies
 */
var config = require('app/config');

/**
 * Log directory
 */
var logDirectory = path.resolve(config.log.path);

/**
 * Module export
 */
module.exports = {

  /**
   * Get log format
   */
	format: function() {
		return config.log.format;
	},

  /**
   * Get log options
   */
	options: function() {

    //Initialize options
    var options = config.log.options || {};

    //Use rotating log file
    if (config.log.rotate) {
      fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
      config.log.rotate.filename = logDirectory + '/' + config.log.rotate.filename;
      options.stream = fileStreamRotator.getStream(config.log.rotate);
    }

    //Use single file
    else if (config.log.filename) {
      fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
      config.log.filename = logDirectory + '/' + config.log.filename;
      options.stream = fs.createWriteStream(config.log.filename, {
        flags: 'a'
      });
    }

		//Return options
		return options;
	}
};
