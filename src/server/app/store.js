'use strict';

/**
 * External dependencies
 */
var fs = require('fs');
var path = require('path');

/**
 * Application dependenices
 */
var config = require('app/config.js');

/**
 * Module export
 */
module.exports = {

  /**
   * Get the relative path for a certain data type and filename
   */
  relativePath: function(type, filename) {
    return path.join(type, filename || '');
  },

  /**
   * Get the absolute path for a certain data type and filename or relative path
   */
  absolutePath: function(type, filename) {
    return path.join(config.paths.data, type, path.basename(filename || ''));
  },

  /**
   * Delete data
   */
  delete: function(type, filename, cb) {
    cb = cb || function() {};
    var filePath = this.absolutePath(type, filename);
    fs.unlink(filePath, cb);
  }
};
