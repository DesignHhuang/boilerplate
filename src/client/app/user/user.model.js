
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

    //Expose default data
    var defaultData = this.defaultData;

    /**
     * Extend API model
     */
    function User(data) {
      $apiModel.call(this, angular.extend(defaultData, data || {}));
    }
    angular.extend(User.prototype, $apiModel.prototype);

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
     * Fetch logged in user data from the server
     */
    User.prototype.me = function() {

      //Get self
      var self = this;

      //Get details from server
      return $api.user.me().then(function(user) {
        self.fromObject(user);
        self.$isLoaded = true;
        return self;
      }, function(response) {
        self.fromObject(defaultData);
        self.$isLoaded = false;
        return $q.reject(response);
      });
    };

    /**
     * Send verification mail
     */
    User.prototype.sendVerificationEmail = function() {
      return $api.user.sendVerificationEmail();
    };

    /**
     * Query (static)
     */
    User.query = function(data) {
      return $api.user.query(data);
    };

    /**
     * Forgot password (static)
     */
    User.forgotPassword = function(credentials) {
      return $api.user.forgotPassword(credentials);
    };

    /**
     * Reset password (static)
     */
    User.resetPassword = function(credentials) {
      return $api.user.resetPassword(credentials);
    };

    /**
     * Verify email (static)
     */
    User.verifyEmail = function(token) {
      return $api.user.verifyEmail({
        token: token
      });
    };

    /**
     * Exists check (static)
     */
    User.exists = function(data) {
      return $api.user.exists(data).then(function(data) {
        if (data.exists) {
          return true;
        }
        return false;
      });
    };

    /**
     * Reference to current user
     */
    User.current = null;

    //Return
    return User;
  };
});
