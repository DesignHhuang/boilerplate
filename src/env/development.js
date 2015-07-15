'use strict';

/**
 * Environment configuration (development)
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
