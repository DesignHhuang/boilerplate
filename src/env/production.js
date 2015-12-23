'use strict';

/**
 * Environment configuration (production)
 */
module.exports = {

  /**
   * Client settings
   */
  client: {

    //App
    app: {
      baseUrl: 'http://my-application.com'
    },

    //Analytics
    analytics: {
      enabled: true,
      trackingId: ''
    }
  },

  /**
   * Server settings
   */
  server: {
    port: process.env.PORT || 80
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
  },

  /**
   * Sendgrid settings
   */
  sendgrid: {
    auth: {
      api_key: ''
    }
  }
};
