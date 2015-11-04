'use strict';

/**
 * External dependencies
 */
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

/**
 * Application dependencies
 */
var tokenizer = require('app/shared/utility/tokenizer.js');
var User = require('app/user/user.model.js');

/**
 * Bearer strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new BearerStrategy(function(accessToken, cb) {

    //Validate token
    tokenizer.validate('access', accessToken, function(error, payload) {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return cb(null, false);
        }
        return cb(error);
      }

      //Find user by matching ID and access token
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
