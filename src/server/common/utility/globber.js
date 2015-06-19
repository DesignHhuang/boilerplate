
/**
 * Module dependencies
 */
var glob = require('glob');
var _ = require('lodash');

/**
 * Globber
 */
module.exports = {

  /**
   * Get files by glob patterns
   */
  files: function(globPatterns, removeRoot) {

    //Get self
  	var self = this;
  	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
  	var output = [];

  	//If glob pattern is array, we use each pattern in a recursive way, otherwise we use glob
  	if (_.isArray(globPatterns)) {
  		globPatterns.forEach(function(globPattern) {
  			output = _.union(output, self(globPattern, removeRoot));
  		});
      return output;
  	}

    //Just string
    else if (_.isString(globPatterns)) {

      //Test if URL
  		if (urlRegex.test(globPatterns)) {
  			output.push(globPatterns);
        return output;
  		}

      //Get files
			var files = glob.sync(globPatterns);

      //Remove root?
			if (removeRoot) {
				files = files.map(function(file) {
					return file.replace(removeRoot, '');
				});
			}

      //Set output
			output = _.union(output, files);
  	}

    //Return output
  	return output;
  }
};
