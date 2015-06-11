'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var mongoose = require('mongoose');

/**
 * Application dependencies
 */
var User = mongoose.model('User');

/**
 * Users controller
 */
module.exports = {

  /**
   * Get details of logged in user
   */
  me: function(req, res) {
  	res.json(req.user || null);
  },

  /**
   * Update user details
   */
  update: function(req, res) {

    //Init Variables
  	var user = req.user;
  	var message = null;

  	//For security measurement we remove the roles from the req.body object
  	delete req.body.roles;

  	if (user) {

      //Merge existing user
  		user = _.extend(user, req.body);
  		user.updated = Date.now();

  		user.save(function(err) {
  			if (err) {
  				return res.status(400).send({
  					message: ''
  				});
  			}
        else {
  				req.login(user, function(err) {
  					if (err) {
  						res.status(400).send(err);
  					} else {
  						res.json(user);
  					}
  				});
  			}
  		});
  	}
    else {
  		res.status(400).send({
  			message: 'User is not signed in'
  		});
  	}
  }
};
