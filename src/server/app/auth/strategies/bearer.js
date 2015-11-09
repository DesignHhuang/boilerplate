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
    tokenizer.validate('access', accessToken).then(function(payload) {

      //No ID?
      if (!payload.id) {
        return cb(null, false, {
          error: 'INVALID_TOKEN'
        });
      }

      //Find user by matching ID and access token
      User.findById(payload.id).then(function(user) {
        if (!user) {
          return cb(null, false, {
            error: 'INVALID_TOKEN'
          });
        }
        return cb(null, user);
      }, function(error) {
        return cb(error);
      });
    }, function(error) {
      if (error.name === 'TokenExpiredError') {
        return cb(null, false, {
          error: 'EXPIRED_TOKEN'
        });
      }
      return cb(error);
    });
  }));
};
