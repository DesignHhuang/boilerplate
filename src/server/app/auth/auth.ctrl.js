'use strict';

/**
 * External dependencies
 */
var passport = require('passport');

/**
 * Application dependencies
 */
var tokenizer = require('app/shared/utility/tokenizer.js');
var UnauthenticatedError = require('app/error/types/unauthenticatedError.js');
var config = require('app/config.js');

/**
 * Constants
 */
var REFRESH_TOKEN_COOKIE_MAX_AGE = config.auth.refreshToken.maxAge * 1000; //in ms
var REFRESH_TOKEN_COOKIE_SECURE = config.auth.refreshToken.httpsOnly;

/**
 * To camel case
 */
function toCamelCase(str, ucfirst) {
  if (typeof str === 'number') {
    return String(str);
  }
  else if (typeof str !== 'string') {
    return '';
  }
  if ((str = String(str).trim()) === '') {
    return '';
  }
  return str
    .replace(/_+|\-+/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) {
        return '';
      }
      return (index === 0 && !ucfirst) ? match.toLowerCase() : match.toUpperCase();
    });
}

/**
 * Auth controller
 */
module.exports = {

  /**
   * Verify authentication
   */
  verify: function(req, res) {
    res.end();
  },

  /**
   * Forget a user
   */
  forget: function(req, res) {
    res.clearCookie('refreshToken', null, {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
    res.end();
  },

  /**
   * Token request handler
   */
  token: function(req, res, next) {

    //Get grant type and initialize access token
    var grantType = toCamelCase(req.body.grantType);
    var remember = !!req.body.remember;

    /**
     * Callback handler
     */
    function authCallback(error, user) {

      //Check error
      if (error) {
        return next(error);
      }

      //No user found?
      if (!user) {
        var errorCode;
        if (grantType === 'password') {
          errorCode = 'INVALID_CREDENTIALS';
        }
        return next(new UnauthenticatedError(errorCode));
      }

      //User suspended?
      if (user.isSuspended) {
        return next(new UnauthenticatedError('USER_SUSPENDED'));
      }

      //Set user in request
      req.user = user;

      //Create claims and generate access token
      var accessToken = tokenizer.generate('access', user.getClaims());

      //Generate refresh token if we want to be remembered
      if (remember) {
        var refreshToken = tokenizer.generate('refresh', user.getClaims());
        res.cookie('refreshToken', refreshToken, {
          maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
          secure: REFRESH_TOKEN_COOKIE_SECURE,
          httpOnly: true
        });
      }

      //Send response
      return res.send({
        accessToken: accessToken
      });
    }

    //Handle specific grant types
    switch (grantType) {
      case 'password':
        passport.authenticate('local', authCallback)(req, res, next);
        break;
      case 'refreshToken':
        passport.authenticate('refresh', authCallback)(req, res, next);
        break;
    }
  }
};
