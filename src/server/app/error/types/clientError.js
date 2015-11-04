'use strict';

/**
 * Module dependencies
 */
var BaseError = require('app/error/types/baseError.js');

/**
 * Error constructor
 */
function ClientError(code, message, data, status) {

  //Validate status
  if (!status || status < 400 || status > 499) {
    status = 400;
  }

  //Call parent constructor
  BaseError.call(this, code, message, data, status);
}

/**
 * Extend base error error
 */
ClientError.prototype = Object.create(BaseError.prototype);
ClientError.prototype.constructor = ClientError;
ClientError.prototype.name = 'ClientError';

/**
 * Module export
 */
module.exports = ClientError;
