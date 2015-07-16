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
   * App settings
   */
  app: {
    name: pkg.name,
    version: pkg.version,
    title: 'My Application',
    baseUrl: '/',
    api: {
      baseUrl: '/api/v1/'
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
    server: 'server'
  },

  /**
   * Project assets
   */
  assets: assets
};
