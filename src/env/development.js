'use strict';

/**
 * Environment configuration (development)
 */
module.exports = {

  /**
   * App settings
   */
  app: {
    title: 'My Application (dev)',
    baseUrl: 'http://localhost:' + (process.env.PORT || 8080)
  },

  /**
   * Server settings
   */
  server: {
    port: process.env.PORT || 8080
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
    debug: true,
    options: {
      user: '',
      pass: ''
    }
  },

  /**
   * Authentication settings
   */
  auth: {
    refreshToken: {
      httpsOnly: false
    }
  },

  /**
   * Build settings
   */
  build: {
    app: {
      js: {
        minify: false
      },
      css: {
        minify: false
      }
    },
    vendor: {
      js: {
        minify: true
      },
      css: {
        minify: true
      }
    }
  }
};
