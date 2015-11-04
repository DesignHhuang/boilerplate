'use strict';

/**
 * Module dependencies
 */
var ClientError = require('app/error/types/clientError.js');

/**
 * Helper to normalize validation data
 */
function normalizeData(raw) {
  var data = {
    fields: {}
  };
  if (raw.errors) {
    for (var field in raw.errors) {
      if (raw.errors.hasOwnProperty(field)) {
        data.fields[field] = {
          type: raw.errors[field].kind,
          message: raw.errors[field].message
        };
      }
    }
  }
  return data;
}

/**
 * Error constructor
 */
function ValidationError(code, message, data) {

  //Parameter juggling
  if (typeof code === 'object') {
    var raw = code;
    data = normalizeData(raw);
    message = message || raw.message;
    code = 'NOT_VALIDATED';
  }

  //Call parent constructor
  ClientError.call(this, code, message, data, 422);
}

/**
 * Extend client error
 */
ValidationError.prototype = Object.create(ClientError.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';

/**
 * Module export
 */
module.exports = ValidationError;
