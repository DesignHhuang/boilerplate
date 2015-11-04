'use strict';

/**
 * Application dependencies
 */
var ServerError = require('app/error/types/serverError.js');
var InternalError = require('app/error/types/internalError.js');

/**
 * Check if internal error
 */
function isInternalError(err) {
  if (err instanceof EvalError) {
    return true;
  }
  if (err instanceof TypeError) {
    return true;
  }
  if (err instanceof RangeError) {
    return true;
  }
  if (err instanceof ReferenceError) {
    return true;
  }
  if (err instanceof SyntaxError) {
    return true;
  }
  if (err instanceof URIError) {
    return true;
  }
  return false;
}

/**
 * Module export
 */
module.exports = function(err, req, res, next) {

  //If this is not an object, create an error representation
  if (typeof err !== 'object') {
    err = new ServerError(String(err));
  }

  //Internal errors
  if (isInternalError(err)) {
    err = new InternalError(err);
  }

  //Must have code
  if (!err.code) {
    err.code = 'UNCAUGHT_ERROR';
  }

  //If this error does not have a response conversion method, create generic server error
  if (typeof err.toResponse !== 'function') {
    err = new ServerError(err.code, err.message, err.data, 500);
  }

  //Ensure that err.message is enumerable (it is not by default)
  Object.defineProperty(err, 'message', {
    enumerable: true
  });

  //Pass to next error handling middleware
  next(err);
};
