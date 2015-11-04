'use strict';

/**
 * External dependencies
 */
var util = require('util');
var Strategy = require('passport-strategy');

/**
 * Define refresh token strategy
 */
function RefreshStrategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  Strategy.call(this);
  this.name = 'refresh';
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(RefreshStrategy, Strategy);

/**
 * Authenticate request based on refresh token in http only cookie
 */
RefreshStrategy.prototype.authenticate = function(req) {

  //Initialize vars
  var refreshToken;
  var self = this;

  //Get refresh token from cookies
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  /**
   * Verification handler
   */
  function verified(error, user, info) {
    if (error) {
      return self.error(error);
    }
    if (!user) {
      info = info || {};
      self.fail('invalid_token', info);
    }
    self.success(user, info);
  }

  //Call verify handler
  this._verify(refreshToken, verified);
};

/**
 * Expose strategy
 */
module.exports = RefreshStrategy;
