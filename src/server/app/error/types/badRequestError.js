'use strict';

/**
 * Module dependencies
 */
var ClientError = require('app/error/types/clientError.js');

/**
 * Error constructor
 */
function BadRequestError(code, message, data) {
  ClientError.call(this, code || 'BAD_REQUEST', message, data, 400);
}

/**
 * Extend client error
 */
BadRequestError.prototype = Object.create(ClientError.prototype);
BadRequestError.prototype.constructor = BadRequestError;
BadRequestError.prototype.name = 'BadRequestError';

/**
 * Module export
 */
module.exports = BadRequestError;
