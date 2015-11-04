'use strict';

/**
 * External dependencies
 */
var jwt = require('jsonwebtoken');

/**
 * Application dependenices
 */
var config = require('app/config.js');

/**
 * Get token config for a certain type
 */
function getTokenConfig(type) {
  var tokenConfig = config.token.types[type] || {};
  tokenConfig.expiration = tokenConfig.expiration || config.token.expiration;
  tokenConfig.audience = tokenConfig.audience || config.token.audience;
  tokenConfig.issuer = tokenConfig.issuer || config.token.issuer;
  tokenConfig.secret = tokenConfig.secret || config.token.secret;
  return tokenConfig;
}

/**
 * Module export
 */
module.exports = {

  /**
   * Generate a token
   */
  generate: function(type, claims) {
    var tokenConfig = getTokenConfig(type);
    return jwt.sign(claims || {}, tokenConfig.secret, {
      audience: tokenConfig.audience,
      issuer: tokenConfig.issuer,
      expiresInSeconds: tokenConfig.expiration
    });
  },

  /**
   * Validate a token
   */
  validate: function(type, token, cb) {
    var tokenConfig = getTokenConfig(type);
    jwt.verify(token, tokenConfig.secret, {
      audience: tokenConfig.audience,
      issuer: tokenConfig.issuer
    }, cb);
  }
};
