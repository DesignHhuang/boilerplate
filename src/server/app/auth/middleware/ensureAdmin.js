'use strict';

/**
 * Module export
 */
module.exports = function(req, res, next) {
  if (!req.user || !req.user.hasRole('admin')) {
    res.status(403).send();
  }
  next();
};
