
/**
 * Module definition and dependencies
 */
angular.module('App.User.UserStore.Service', [])

/**
 * Model definition
 */
.factory('UserStore', function($q, $cacheFactory, Auth, User) {

  //User instance
  var userInstance = null;

  /**
   * User store class
   */
  var UserStore = {

    /**
     * Get the user instance immediately
     */
    getUser: function() {
      return userInstance;
    },

    /**
     * Set the user instance manually
     */
    setUser: function(user) {
      userInstance = user;
    },

    /**
     * Clear the user instance
     */
    clearUser: function() {
      userInstance = null;
    },

    /**
     * Get the user instance via a promise
     */
    getUserPromise: function() {

      //Got instance already?
      if (userInstance) {
        return $q.when(userInstance);
      }

      //Otherwise, find the authenticated user
      return this.findAuthenticatedUser();
    },

    /**
     * Find authenticated user
     */
    findAuthenticatedUser: function() {
      return User.me().catch(function(error) {
        Auth.forget();
        return $q.reject(error);
      });
    }
  };

  //Return
  return UserStore;
});
