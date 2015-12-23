
/**
 * Module definition and dependencies
 */
angular.module('App.User.Model', [])

/**
 * Provider definition
 */
.provider('User', function UserProvider() {

  /**
   * Settings
   */
  this.defaultData = {
    $isLoaded: false
  };

  /**
   * Set default data
   */
  this.setDefaultData = function(data) {
    this.defaultData = angular.copy(data);
  };

  /**
   * Service getter
   */
  this.$get = function($q, $api, $apiModel) {

    //Expose default data and get booking model
    var defaultData = this.defaultData;

    /**
     * User constructor
     */
    function User(data) {

      //Call parent constructor
      $apiModel.call(this, angular.extend({}, defaultData, data || {}));

      /**
       * Virtual name property
       */
      Object.defineProperty(this, 'name', {
        get: function() {
          return String(this.firstName + ' ' + this.lastName).trim();
        }
      });
    }
    angular.extend(User.prototype, $apiModel.prototype);

    /*****************************************************************************
     * Instance methods
     ***/

    /**
     * Save user
     */
    User.prototype.save = function() {
      var method = this.id ? 'update' : 'create';
      return $api.user[method](this).then(function() {
        this.$isLoaded = true;
        return this;
      }.bind(this));
    };

    /**
     * Send verification mail
     */
    User.prototype.sendVerificationEmail = function() {
      return $api.user.sendVerificationEmail();
    };

    /*****************************************************************************
     * Static methods
     ***/

    /**
     * Fetch logged in user from the server
     */
    User.me = function() {
      return $api.user.me().then(function(data) {
        return new User(data);
      });
    };

    /**
     * Query
     */
    User.query = function(filter) {
      return $api.user.query(filter);
    };

    /**
     * Forgot password
     */
    User.forgotPassword = function(credentials) {
      return $api.user.forgotPassword(credentials);
    };

    /**
     * Reset password
     */
    User.resetPassword = function(credentials) {
      return $api.user.resetPassword(credentials);
    };

    /**
     * Verify email
     */
    User.verifyEmail = function(token) {
      return $api.user.verifyEmail({
        token: token
      });
    };

    /**
     * Exists check
     */
    User.exists = function(data) {
      return $api.user.exists(data).then(function(data) {
        if (data.exists) {
          return true;
        }
        return false;
      });
    };

    //Return
    return User;
  };
});
