'use strict';

/**
 * Development environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		title: 'My Application (dev)'
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
