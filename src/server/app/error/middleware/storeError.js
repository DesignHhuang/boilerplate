'use strict';

/**
 * External dependencies
 */
var mongoose = require('mongoose');

/**
 * Module export
 */
module.exports = function(err, req, res, next) {

  //Create error data
  var data = {
    name: err.name || 'UnknownError',
    code: err.code || '',
    message: err.message || '',
    data: err.data || null,
    stack: err.stack || null,
    request: {
      url: req.baseUrl,
      headers: req.headers,
      body: req.body
    },
    user: req.user ? req.user._id : null
  };

  //Save in database
  mongoose.model('Error').create(data);

  //Proceed to next middleware
  next(err);
};
