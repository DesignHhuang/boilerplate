'use strict';

/**
 * Module dependencies
 */
var ClientError = require('app/error/types/clientError.js');

/**
 * Error constructor
 */
function UnauthenticatedError(code, message, data) {
  ClientError.call(this, code || 'NOT_AUTHENTICATED', message, data, 401);
}

/**
 * Extend client error
 */
UnauthenticatedError.prototype = Object.create(ClientError.prototype);
UnauthenticatedError.prototype.constructor = UnauthenticatedError;
UnauthenticatedError.prototype.name = 'UnauthenticatedError';

/**
 * Module export
 */
module.exports = UnauthenticatedError;
