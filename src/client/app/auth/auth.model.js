
/**
 * Module definition and dependencies
 */
angular.module('App.Auth.Model', [
  'Api.Model'
])

/**
 * Model definition
 */
.factory('AuthModel', function($log, $convert, $apiModel) {

  /**
   * Decode token payload helper
   */
  function decodeTokenPayload(token) {

    //No token?
    if (!token) {
      return null;
    }

    //Split in parts
    var parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    //Get decoded payload
    try {
      var decoded = $convert.string.fromBase64(parts[1]);
      return angular.fromJson(decoded);
    }
    catch (e) {
      $log.warn('Could not decode payload from access token:', token);
      return null;
    }
  }

  /**
   * Extend API model
   */
  function AuthModel(data) {
    $apiModel.call(this, data);
  }
  angular.extend(AuthModel.prototype, $apiModel.prototype);

  /**
   * Reset
   */
  AuthModel.prototype.reset = function() {
    this.fromObject();
  };

  /**
   * From token
   */
  AuthModel.prototype.fromToken = function(accessToken) {
    if (!accessToken || typeof accessToken !== 'string') {
      return null;
    }
    return this.fromObject({
      accessToken: accessToken
    });
  };

  /**
   * From object
   */
  AuthModel.prototype.fromObject = function(data) {

    //Call parent method
    $apiModel.prototype.fromObject.call(this, data);

    //Can't decode payload if no access token present
    if (!this.accessToken) {
      this.accessToken = '';
      return null;
    }

    //Get claims from access token
    this.claims = decodeTokenPayload(this.accessToken) || {};
    if (!this.claims) {
      this.accessToken = '';
      return null;
    }

    //Parse roles
    this.claims.roles = this.claims.roles || [];
    if (!angular.isArray(this.claims.roles)) {
      this.claims.roles = this.claims.roles.split(' ');
    }

    //Return self
    return this;
  };

  /**
   * Check if we have a certain role
   */
  AuthModel.prototype.hasRole = function(role) {
    return (this.claims && this.claims.roles && this.claims.roles.indexOf(role) > -1);
  };

  //Return
  return AuthModel;
});
