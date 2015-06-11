'use strict';

/**
 * Users routing
 */
module.exports = function(app) {

  //Users controller
	var users = require('app/users/users.controller');

	//Users API
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);

	//Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	//Bind user by ID middleware
	app.param('userId', users.userByID);
};
