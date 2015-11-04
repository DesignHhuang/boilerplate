
/**
 * Module definition and dependencies
 */
angular.module('App.User.Model', [
  'Api.Model'
])

/**
 * Model definition
 */
.factory('UserModel', function($api, $apiModel) {

  /**
   * Extend API model
   */
  function UserModel(data) {
    $apiModel.call(this, data);
  }
  angular.extend(UserModel.prototype, $apiModel.prototype);

  /**
   * Save user
   */
  UserModel.prototype.save = function() {
    var method = this.id ? 'update' : 'create';
    return $api.user[method](this).then(function() {
      this.isLoaded = true;
      return this;
    }.bind(this));
  };

  /**
   * Verify email
   */
  UserModel.prototype.verifyEmail = function(token) {
    return $api.user.verifyEmail({
      token: token
    });
  };

  /**
   * Send verification mail
   */
  UserModel.prototype.sendVerificationEmail = function() {
    return $api.user.sendVerificationEmail();
  };

  /**
   * Forgot password
   */
  UserModel.prototype.forgotPassword = function(credentials) {
    return $api.user.forgotPassword(credentials);
  };

  /**
   * Reset password
   */
  UserModel.prototype.resetPassword = function(credentials) {
    return $api.user.resetPassword(credentials);
  };

  /**
   * Query (static)
   */
  UserModel.query = function(data) {
    return $api.user.query(data);
  };

  /**
   * Exists check (static)
   */
  UserModel.exists = function(data) {
    return $api.user.exists(data).then(function(data) {
      if (data.exists) {
        return true;
      }
      return false;
    });
  };

  //Return
  return UserModel;
});
