'use strict';

/**
 * External dependencies
 */
var jwt = require('jsonwebtoken');
var chalk = require('chalk');

/**
 * Application dependenices
 */
var config = require('app/config.js');

/**
 * Get token config for a certain type
 */
function getConfig(type) {
  var cfg = config.token.types[type] || {};
  cfg.expiration = cfg.expiration || config.token.expiration;
  cfg.audience = cfg.audience || config.token.audience;
  cfg.issuer = cfg.issuer || config.token.issuer;
  cfg.secret = cfg.secret || config.token.secret;
  return cfg;
}

/**
 * Ensure token config is valid
 */
function ensureValidConfig(cfg) {
  if (!cfg.secret || !cfg.audience || !cfg.issuer) {
    return false;
  }
  return true;
}

/**
 * Module export
 */
module.exports = {

  /**
   * Generate a token
   */
  generate: function(type, claims) {
    var cfg = getConfig(type);
    if (!ensureValidConfig(cfg)) {
      console.warn(chalk.yellow('Missing secret for token configuration of type', type));
      return '';
    }
    return jwt.sign(claims || {}, cfg.secret, {
      audience: cfg.audience,
      issuer: cfg.issuer,
      expiresIn: cfg.expiration
    });
  },

  /**
   * Validate a token
   */
  validate: function(type, token) {
    return new Promise(function(resolve, reject) {

      //Get and validate configuration
      var cfg = getConfig(type);
      if (!ensureValidConfig(cfg)) {
        return reject(new Error('Missing secret for token configuration of type ' + type));
      }

      //Verify token with secret
      jwt.verify(token, cfg.secret, {
        audience: cfg.audience,
        issuer: cfg.issuer
      }, function(error, payload) {
        if (error) {
          return reject(error);
        }
        resolve(payload);
      });
    });
  }
};
