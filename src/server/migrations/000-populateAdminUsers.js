'use strict';

/**
 * External dependencies
 */
var async = require('async');

/**
 * Application dependencies
 */
var User = require('app/user/user.model.js');

/**
 * Data
 */
var users = [
  {
    name: 'Admin',
    email: 'admin@my-application.com',
    password: 'test123',
    isSuspended: false,
    isEmailVerified: true,
    roles: ['admin']
  }
];

/**
 * Migration
 */
module.exports = {

  /**
   * Migrate up
   */
  up: function(cb) {

    /**
     * Helper to check if a user exists
     */
    function checkExists(user, cb) {
      User.findOne({
        email: user.email
      }).then(function(found) {
        cb(null, found ? found.email : null);
      }, cb);
    }

    //Find all existing users
    async.map(users, checkExists, function(error, existing) {

      //Filter existing users
      users = users.filter(function(user) {
        if (existing.indexOf(user.email) < 0) {
          return true;
        }
      });

      //Create users now
      User.create(users, cb);
    });
  },

  /**
   * Migrate down
   */
  down: function(cb) {

    //Collect emails
    var emails = users.map(function(user) {
      return user.email;
    });

    //Remove admin users
    User.remove({
      email: {
        $in: emails
      }
    }, cb);
  }
};
