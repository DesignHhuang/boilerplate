
/**
 * Module definition and dependencies
 */
angular.module('App.User.Service', [
  'App.User.Model'
])

/**
 * Provider definition
 */
.provider('User', function UserProvider() {

  /**
   * Settings
   */
  var defaultData = {};
  var usingStorage = false;

  /**
   * Set default data
   */
  this.setDefaultData = function(data) {
    defaultData = angular.copy(data);
  };

  /**
   * Set whether or not user data should persist in storage
   */
  this.useStorage = function(useStorage) {
    usingStorage = !!useStorage;
  };

  /**
   * Service getter
   */
  this.$get = function($rootScope, $window, $q, $api, $storage, Auth, UserModel) {

    //Add isLoaded flag to default data
    defaultData.isLoaded = false;

    //Helper vars
    var mePromise = null;

    /**
     * Store user data in storage
     */
    function setStoredData(data) {
      var engine = Auth.getStorageEngine();
      $storage[engine].set('userData', data);
    }

    /**
     * Clear user data from storage
     */
    function clearStoredData() {
      var engine = Auth.getStorageEngine();
      $storage[engine].remove('userData');
    }

    /**
     * Get user data from storage
     */
    function getStoredData() {
      var engine = Auth.getStorageEngine();
      return $storage[engine].get('userData', {});
    }

    /**
     * Extend user model
     */
    function User(data) {
      UserModel.call(this, data);
    }
    angular.extend(User.prototype, UserModel.prototype);

    /**
     * From storage
     */
    User.prototype.fromStorage = function() {
      var storedData = getStoredData();
      if (storedData) {
        this.fromObject(storedData);
      }
      return this;
    };

    /**
     * Is present check
     */
    User.prototype.isPresent = function() {
      return this.isLoaded && Auth.isAuthenticated();
    };

    /**
     * Reset
     */
    User.prototype.reset = function() {
      this.fromObject(defaultData);
      if (usingStorage) {
        clearStoredData();
      }
      $rootScope.$broadcast('user.loaded', null);
      return this;
    };

    /**
     * Load user data
     */
    User.prototype.load = function(data) {
      this.fromObject(data);
      this.isLoaded = true;
      if (usingStorage) {
        setStoredData(this.toObject());
      }
      $rootScope.$broadcast('user.loaded', this);
      return this;
    };

    /**
     * Fetch logged in user data from the server
     */
    User.prototype.me = function() {

      //Already in flight?
      if (mePromise) {
        return mePromise;
      }

      //Get self
      var self = this;

      //Get details from server
      mePromise = $api.user.me().then(function(data) {
        return self.load(data);
      }, function(response) {
        self.reset();
        return $q.reject(response.data);
      }).finally(function() {
        mePromise = null;
      });

      //Return promise
      return mePromise;
    };

    /**
     * Check if currently fetching user details
     */
    User.prototype.isFetching = function() {
      return !!mePromise;
    };

    //Create instance
    var user = new User(defaultData);

    //Initial load from storage if enabled
    if (usingStorage) {
      user.fromStorage();
    }

    /**
     * Listen for authentication events
     */
    $rootScope.$on('auth.status', function(event, auth) {
      if (auth.isAuthenticated) {
        user.me();
      }
      else {
        user.reset();
      }
    });

    /**
     * Listen for storage events
     */
    if (usingStorage) {
      angular.element($window).on('storage', function() {
        $rootScope.$apply(function() {
          user.fromStorage();
        });
      });
    }

    //Return instance
    return user;
  };
});
