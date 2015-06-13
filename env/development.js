'use strict';

/**
 * Development environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		title: 'Meanie Boilerplate (development environment)'
	},

	/**
   * Server settings
   */
	server: {
    port: process.env.PORT || 8080,
  },

  /**
   * Log settings
   */
	log: {
		format: 'dev'
	},

  /**
   * Database settings
   */
  db: {
 		uri: 'mongodb://localhost/meanie',
 		options: {
 			user: '',
 			pass: ''
 		}
 	}
};
