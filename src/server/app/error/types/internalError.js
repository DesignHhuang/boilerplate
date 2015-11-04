'use strict';

/**
 * Module dependencies
 */
var BaseError = require('app/error/types/baseError.js');

/**
 * Error constructor
 */
function InternalError(error) {

  //Set name and maintain stack properties
  this.name = error.name;
  this.stack = error.stack || null;

  //Use base error constructor now
  BaseError.call(this, 'INTERNAL_ERROR', error.message, null, 500);
}

/**
 * Extend base error error
 */
InternalError.prototype = Object.create(BaseError.prototype);
InternalError.prototype.constructor = InternalError;
InternalError.prototype.name = 'InternalError';

/**
 * Convert to simple object for JSON responses (does not expose message)
 */
InternalError.prototype.toResponse = function() {
  var error = {
    code: this.code
  };
  return error;
};

/**
 * Module export
 */
module.exports = InternalError;
