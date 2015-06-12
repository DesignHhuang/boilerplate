'use strict';

/**
 * Global environment configuration
 */
module.exports = {

  /**
   * Server settings
   */
	server: {
    port: process.env.PORT || 80,
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
	}
};
