
/**
 * Module definition and dependencies
 */
angular.module('App.Auth.Service', [
  'App.Auth.Model'
])

/**
 * Provider definition
 */
.provider('Auth', function AuthProvider() {

  //Client identifier
  this.clientIdentifier = '';

  //Refreshing of access tokens enabled?
  this.refreshEnabled = true;

  //Verify authentication against server
  this.verifyAgainstServer = false;

  //How to store access tokens (memory / session / local / cookie)
  this.storageEngine = 'local';

  //Forced conversion of grant type to snake case
  this.forceSnakeCase = false;

  /**
   * Set client identifier
   */
  this.setClientIdentifier = function(clientIdentifier) {
    this.clientIdentifier = clientIdentifier;
    return this;
  };

  /**
   * Set whether or not refreshing of access tokens is enabled
   */
  this.setRefreshEnabled = function(refreshEnabled) {
    this.refreshEnabled = !!refreshEnabled;
    return this;
  };

  /**
   * Set whether or not to verify initial auth state against server
   */
  this.setVerifyAgainstServer = function(verifyAgainstServer) {
    this.verifyAgainstServer = !!verifyAgainstServer;
    return this;
  };

  /**
   * Set the storage engine
   */
  this.setStorageEngine = function(storageEngine) {
    this.storageEngine = storageEngine;
    return this;
  };

  /**
   * Set snake case forcing
   */
  this.setForceSnakeCase = function(forceSnakeCase) {
    this.forceSnakeCase = forceSnakeCase;
    return this;
  };

  /**
   * Service getter
   */
  this.$get = function(
    $rootScope, $q, $window, $timeout, $log, $convert, $storage, $api, AuthModel
  ) {

    //Config vars
    var clientIdentifier = this.clientIdentifier;
    var refreshEnabled = this.refreshEnabled;
    var verifyAgainstServer = this.verifyAgainstServer;
    var storageEngine = this.storageEngine;
    var forceSnakeCase = this.forceSnakeCase;

    //Helper vars
    var tokenPromise = null;
    var verifyPromise = null;
    var rememberSession = false;

    //Auth model
    var model = new AuthModel();

    /**
     * Obtain token from server
     */
    function obtainToken(grantType, data) {

      //Are we already obtaining a token? Return that promise to prevent multiple requests
      if (tokenPromise) {
        return tokenPromise;
      }

      //Force snake case?
      if (forceSnakeCase) {
        grantType = $convert.string.toSnakeCase(grantType);
      }

      //Extend data
      data = data || {};
      angular.extend(data, {
        clientId: clientIdentifier,
        grantType: grantType,
        remember: rememberSession
      });

      //Get token from server
      tokenPromise = $api.auth.token(data).then(function(auth) {

        //Process auth data
        if (!model.fromObject(auth)) {
          clearAccessToken();
          return $q.reject(new Error('Invalid access token'));
        }

        //Store access token and return claims
        storeAccessToken(model.accessToken);
        return model.claims;
      }, function(reason) {
        return $q.reject(reason);
      }).finally(function() {
        tokenPromise = null;
      });

      //Return promise
      return tokenPromise;
    }

    /**
     * Broadcast auth status update
     */
    function broadcastAuthStatus(data) {

      //Extend data
      data = angular.extend({
        isAuthenticated: false,
        isUserInitiated: false,
        isInitial: false
      }, data);

      //Broadcast
      $log.info('AUTH:', data);
      $rootScope.$broadcast('auth.status', data);
    }

    /**
     * Get access token
     */
    function getAccessToken() {
      return $storage[storageEngine].get('auth.accessToken', '');
    }

    /**
     * Store access token
     */
    function storeAccessToken(accessToken) {
      $storage[storageEngine].set('auth.accessToken', accessToken);
    }

    /**
     * Clear access token
     */
    function clearAccessToken() {
      $storage[storageEngine].remove('auth.accessToken');
    }

    /*****************************************************************************
     * Auth interface
     ***/

    /**
     * Auth service
     */
    var Auth = {

      /**
       * Initialization
       */
      init: function() {

        //Get access token
        var accessToken = getAccessToken();
        var isAuthenticated = false;

        //If access token present, set auth data
        if (accessToken) {
          if (!model.fromToken(accessToken)) {
            clearAccessToken();
          }
          else {
            isAuthenticated = true;
          }
        }

        //Verify against server?
        if (isAuthenticated && verifyAgainstServer) {
          return this.verify().finally(function() {
            broadcastAuthStatus({
              isAuthenticated: Auth.isAuthenticated(),
              isInitial: true
            });
          });
        }

        //Not authenticated but using refresh tokens?
        if (!isAuthenticated && refreshEnabled) {
          return this.refresh().finally(function() {
            broadcastAuthStatus({
              isAuthenticated: Auth.isAuthenticated(),
              isInitial: true
            });
          });
        }

        //Broadcast initial auth status
        $timeout(function() {
          broadcastAuthStatus({
            isAuthenticated: isAuthenticated,
            isInitial: true
          });
        });
      },

      /**
       * Reset authentication
       */
      reset: function() {
        clearAccessToken();
        model.reset();
      },

      /**
       * Verify authentication against server
       */
      verify: function() {

        //Already verifying?
        if (verifyPromise) {
          return verifyPromise;
        }

        //Verify against server
        verifyPromise = $api.auth.verify().then(function() {
          return true;
        }, function() {

          //Try to refresh as a last resort
          return Auth.refresh(true).then(function() {
            return true;
          }, function() {
            Auth.reset();
            return false;
          });
        }).finally(function() {
          verifyPromise = null;
        });

        //Return promise
        return verifyPromise;
      },

      /**
       * Consume access token which was obtained elsewhere
       */
      consumeToken: function(accessToken) {

        //Check if the same as what we already have
        if (accessToken === model.accessToken) {
          return $q.when(model.claims);
        }

        //Process access token
        if (!model.fromToken(accessToken)) {
          this.logout(true);
          return $q.reject(new Error('Invalid access token'));
        }

        //Store access token
        storeAccessToken(accessToken);

        //Broadcast auth status update
        broadcastAuthStatus({
          isAuthenticated: true
        });

        //Resolve
        return $q.when(model.claims);
      },

      /**
       * Do a login
       */
      login: function(grantType, data) {
        return obtainToken(grantType, data).then(function() {
          broadcastAuthStatus({
            isAuthenticated: true,
            isUserInitiated: true
          });
        }, function() {
          Auth.logout(true);
        });
      },

      /**
       * Refresh access token
       *
       * Note that the refresh token is not stored in the client for security reasons.
       * It could instead be stored in a http-only cookie.
       */
      refresh: function(isInitial) {

        //Refreshing of access tokens not enabled?
        if (!refreshEnabled) {
          return $q.reject(new Error('Refreshing not enabled'));
        }

        //Obtain token from server
        return obtainToken('refreshToken').catch(function(reason) {
          if (!isInitial) {
            Auth.logout(true);
          }
          return $q.reject(reason);
        });
      },

      /**
       * Do a logout
       */
      logout: function(isAutomatic) {

        //Remember current status
        var wasAuthenticated = this.isAuthenticated();

        //Reset
        this.reset();

        //Forget on server if using refresh tokens
        if (refreshEnabled) {
          $api.auth.forget();
        }

        //Were we authenticated? Broadcast auth status change
        if (wasAuthenticated) {
          broadcastAuthStatus({
            isAuthenticated: false,
            isUserInitiated: !isAutomatic
          });
        }
      },

      /**
       * Remember the session (for auto access token storage)
       */
      rememberSession: function(remember) {
        rememberSession = !!remember;
      },

      /**
       * Check if server authentication is currently in progress
       */
      isVerifying: function() {
        return !!verifyPromise;
      },

      /**
       * Check if we're currently authenticated
       */
      isAuthenticated: function() {
        return !!model.accessToken;
      },

      /**
       * Get storage engine
       */
      getStorageEngine: function() {
        return storageEngine;
      },

      /**
       * Get access token
       */
      getAccessToken: function() {
        return getAccessToken();
      },

      /**
       * Get claims
       */
      getClaims: function() {
        return model.claims || {};
      },

      /**
       * Has role check
       */
      hasRole: function(role) {
        return model.hasRole(role);
      },

      /**
       * Admin check
       */
      isAdmin: function() {
        return model.hasRole('admin');
      }
    };

    //Initialize
    Auth.init();

    /**
     * Listen for storage events
     */
    if (storageEngine === 'local' || storageEngine === 'session') {
      angular.element($window).on('storage', function() {
        $rootScope.$apply(function() {
          var accessToken = getAccessToken();
          Auth.consumeToken(accessToken);
        });
      });
    }

    //Return
    return Auth;
  };
});
