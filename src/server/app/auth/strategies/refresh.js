'use strict';

/**
 * External dependencies
 */
var passport = require('passport');

/**
 * Application dependencies
 */
var RefreshStrategy = require('app/auth/passport/refreshStrategy.js');
var tokenizer = require('app/shared/utility/tokenizer.js');
var User = require('app/user/user.model.js');

/**
 * Refresh token strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new RefreshStrategy(function(refreshToken, cb) {

    //No refresh token?
    if (!refreshToken) {
      return cb(null, false);
    }

    //Validate token
    tokenizer.validate('refresh', refreshToken, function(error, payload) {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return cb(null, false);
        }
        return cb(error);
      }

      //Find user by matching ID
      User.findById(payload.id).then(function(user) {
        if (!user) {
          return cb(null, false, {
            error: 'User not found'
          });
        }
        return cb(null, user);
      }, function(error) {
        return cb(error);
      });
    });
  }));
};
