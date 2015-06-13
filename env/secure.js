'use strict';

/**
 * Secure environment configuration
 */
module.exports = {

  /**
   * Server settings
   */
	server: {
    port: 8443
  },

	/**
   * Log settings
   */
	log: {
		format: 'combined',
    rotate: {
      filename: 'access.%DATE%.log',
      frequency: 'daily',
      verbose: false
    }
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
