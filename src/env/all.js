'use strict';

/**
 * Environment files contain environment specific configuration, like API keys, database
 * passwords, etc. You can create as many environment files as needed. If you want to
 * create a local environment file (for local keys/passwords that won't be included in
 * version control), please run `meanie env`. To create any other named environment, run
 * `meanie env environment-name`.
 */

/**
 * Get package info and project assets
 */
var pkg = require('../package.json');
var assets = require('../assets.json');

/**
 * Environment configuration (shared/base configuration)
 */
module.exports = {

  /**
   * Client settings
   */
  client: {

    //App
    app: {
      name: pkg.name,
      version: pkg.version,
      title: 'My Application',
      baseUrl: '/'
    },

    //API
    api: {
      version: 1,
      baseUrl: '/api/v1/',
      verbose: false
    },

    //Authentication
    auth: {
      clientIdentifier: pkg.name
    },

    //Analytics
    analytics: {
      enabled: false,
      trackingId: ''
    }
  },

  /**
   * Authentication settings
   */
  auth: {
    refreshToken: {
      httpsOnly: true,
      maxAge: 30 * 24 * 3600 //seconds
    }
  },

  /**
   * Token settings
   */
  token: {
    audience: 'http://my-application.com/app',
    issuer: 'http://my-application.com/api',
    types: {
      access: {
        secret: '',
        expiration: 3600 //seconds
      },
      refresh: {
        secret: '',
        expiration: 30 * 24 * 3600 //seconds
      },
      verifyEmail: {
        secret: '',
        expiration: 48 * 3600 //seconds
      },
      resetPassword: {
        secret: '',
        expiration: 24 * 3600 //seconds
      }
    }
  },

  /**
   * Cryptography settings
   */
  bcrypt: {
    rounds: 10
  },

  /**
   * Internationalization settings
   */
  i18n: {
    directory: './server/app/locales',
    locales: ['en'],
    defaultLocale: 'en',
    objectNotation: true
  },

  /**
   * Mailer settings
   */
  mailer: {
    from: {
      noreply: 'My Application <no-reply@my-application.com>'
    },
    to: {
      admin: 'Admin <admin@my-application.com>'
    }
  },

  /**
   * Log settings
   */
  log: {
    format: 'combined',
    path: './logs'
  },

  /**
   * Paths
   */
  paths: {
    public: 'public',
    client: 'client',
    server: 'server',
    deploy: 'deploy',
    data: 'data',
    env: 'env'
  },

  /**
   * Build settings
   */
  build: {
    app: {
      js: {
        minify: true
      },
      css: {
        minify: true
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
  },

  /**
   * Project assets
   */
  assets: assets
};
