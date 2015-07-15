'use strict';

/**
 * Environment configuration (production)
 */
module.exports = {

  /**
   * Server settings
   */
  server: {
    port: 80,
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
   * oAuth settings
   */
  oAuth: {
    Google: {
      clientId: ''
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
