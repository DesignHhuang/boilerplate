'use strict';

/**
 * External dependencies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Application dependencies
 */
var User = require('app/user/user.model.js');

/**
 * Local strategy
 */
module.exports = function() {

  //Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, cb) {

    //Find user by email
    User.findByEmailAndPopulate(email).then(function(user) {
      if (!user) {
        return cb(null, false);
      }

      //Compare user's password
      user.comparePassword(password, function(error, isMatch) {
        if (error) {
          return cb(error);
        }
        if (!isMatch) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }, function(error) {
      return cb(error);
    });
  }));
};
