'use strict';

/**
 * Global environment configuration
 */
module.exports = {

  /**
   * App settings
   */
	app: {
		title: 'MyApp (Dev environment)'
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
 		uri: 'mongodb://localhost/myapp',
 		options: {
 			user: '',
 			pass: ''
 		}
 	},
};
