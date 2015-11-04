'use strict';

/**
 * Module export
 */
module.exports = function(err, req, res, next) {
  next = next || null;
  return res.status(err.status || 500).json(err.toResponse());
};
