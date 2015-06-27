
/**
 * Module dependencies
 */
var glob = require('glob');

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
    if (Array.isArray(globPatterns)) {
      globPatterns.forEach(function(globPattern) {
        output = output.concat(self(globPattern, removeRoot));
      });
      return output;
    }

    //Just string
    else if (typeof globPatterns === 'string') {

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
      output = output.concat(files);
    }

    //Return unique files
    return output.filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });
  }
};
