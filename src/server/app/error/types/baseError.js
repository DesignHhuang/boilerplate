'use strict';

/**
 * Base error class
 */
function BaseError(code, message, data, status) {

  //Parameter juggling
  if (message && typeof message === 'object') {
    status = data;
    data = message;
    message = '';
  }
  else if (typeof message === 'number') {
    status = message;
    message = '';
  }

  //Set code, status, message and data
  this.code = code || 'ERROR';
  this.status = status || 500;
  this.message = message || '';
  this.data = data || null;
}

/**
 * Error name
 */
BaseError.prototype.name = 'Error';

/**
 * Convert to simple object for JSON responses
 */
BaseError.prototype.toResponse = function() {
  var error = {
    code: this.code
  };
  if (this.message) {
    error.message = this.message;
  }
  if (this.data) {
    error.data = this.data;
  }
  return error;
};

/**
 * Module export
 */
module.exports = BaseError;
