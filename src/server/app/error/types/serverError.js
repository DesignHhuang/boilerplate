'use strict';

/**
 * Module dependencies
 */
var BaseError = require('app/error/types/baseError.js');

/**
 * Error constructor
 */
function ServerError(code, message, data, status) {

  //Validate status
  if (!status || status < 500 || status > 599) {
    status = 500;
  }

  //Call parent constructor
  BaseError.call(this, code, message, data, status);
}

/**
 * Extend base error error
 */
ServerError.prototype = Object.create(BaseError.prototype);
ServerError.prototype.constructor = ServerError;
ServerError.prototype.name = 'ServerError';

/**
 * Module export
 */
module.exports = ServerError;
