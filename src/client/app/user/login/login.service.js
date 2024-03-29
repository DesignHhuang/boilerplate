
/**
 * Module definition and dependencies
 */
angular.module('App.User.Login.Service', [])

/**
 * Service definition
 */
.provider('Login', function LoginProvider() {

  /**
   * Service getter
   */
  this.$get = function($q, $state, Auth) {

    //Post login redirect state name and params
    var postLoginState = '';
    var postLoginParams = {};

    /**
     * Service class
     */
    var Login = {

      /**
       * Login now
       */
      now: function(redirectState, redirectParams) {

        //Remember redirect state
        postLoginState = redirectState || '';
        postLoginParams = redirectParams || {};

        //Redirect to login state
        return $state.go('login');
      },

      /**
       * Login with credientials
       */
      withCredentials: function(credentials, remember) {

        //Create deferred
        var deferred = $q.defer();

        //Attempt a login, redirect to the home state by default
        Auth.rememberSession(remember);
        Auth.login('password', credentials).then(function(data) {
          deferred.resolve(data);
        }, function(reason) {
          deferred.reject(reason);
        }, function(progress) {
          deferred.notify(progress);
        });

        //Return promise
        return deferred.promise;
      },

      /**
       * Login with oAuth
       */
      withOAuth: function(oAuthToken, data, remember) {

        //Create deferred
        var deferred = $q.defer();

        //Add token to data
        data = angular.extend(data || {}, {
          externalToken: oAuthToken
        });

        //Attempt a login, redirect to the home state by default
        Auth.rememberSession(remember);
        Auth.login('external_token', data).then(function(data) {
          deferred.resolve(data);
        }, function(reason) {
          deferred.reject(reason);
        }, function(progress) {
          deferred.notify(progress);
        });

        //Return promise
        return deferred.promise;
      },

      /**
       * Login with token obtained elsewhere
       */
      withToken: function(token, remember) {

        //Create deferred
        var deferred = $q.defer();

        //Consume token
        Auth.rememberSession(remember);
        Auth.consumeToken(token).then(function(data) {
          deferred.resolve(data);
        }, function(reason) {
          deferred.reject(reason);
        }, function(progress) {
          deferred.notify(progress);
        });

        //Return promise
        return deferred.promise;
      },

      /**
       * Do a redirect (and clear remembered state afterwards)
       */
      redirect: function(fallbackState, fallbackParams) {

        //Get valid state
        if (!postLoginState) {
          if (!fallbackState) {
            return $q.when(null);
          }

          //Use fallback
          postLoginState = fallbackState;
          postLoginParams = fallbackParams || {};
        }

        //Redirect
        var redirectPromise = $state.go(postLoginState, postLoginParams);

        //Clear remembered state
        postLoginState = '';
        postLoginParams = {};

        //Return promise
        return redirectPromise;
      },

      /**
       * Set the desired post-login redirect state
       */
      setPostLoginState: function(state, params) {
        postLoginState = state || '';
        postLoginParams = params || {};
      },

      /**
       * Get the desired post-login redirect state name
       */
      getPostLoginState: function() {
        return {
          name: postLoginState,
          params: postLoginParams
        };
      }
    };

    //Return
    return Login;
  };
});
