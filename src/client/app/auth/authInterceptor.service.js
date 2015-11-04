
/**
 * Module definition and dependencies
 */
angular.module('App.Auth.AuthInterceptor', [])

/**
 * Interceptor service
 */
.factory('AuthInterceptor', function($rootScope, $q, $injector) {

  //Store services
  var Auth, $http;

  /**
   * Determine if this is a HTML template request
   */
  function isTemplateRequest(request) {
    return (request && request.url.indexOf('.html') !== -1);
  }

  /**
   * Helper to retry a http request
   */
  function retryHttpRequest(request, deferred) {

    //Get http service
    $http = $http || $injector.get('$http');

    //Make sure this retry is not captured by duplicate requests filters
    request.ignoreDuplicateRequest = true;

    //Retry the request
    $http(request).then(function(response) {
      deferred.resolve(response);
    }, function(reason) {
      deferred.reject(reason);
    });
  }

  /**
   * Append the access token to the headers of a http configuration object
   */
  function appendAccessToken(request) {

    //Get Auth service
    Auth = Auth || $injector.get('Auth');

    //Initialize headers if needed
    request.headers = request.headers || {};

    //Get access token and append to header if present
    var accessToken = Auth.getAccessToken();
    if (accessToken) {
      request.headers.Authorization = 'Bearer ' + accessToken;
    }

    //Return request config
    return request;
  }

  /**
   * Interceptor object
   */
  return {

    /**
     * Append access token header to request
     */
    request: function(request) {

      //Don't append to template requests
      if (isTemplateRequest(request)) {
        return request;
      }

      //Append access token to headers
      request = appendAccessToken(request);

      //Append access token
      return request;
    },

    /**
     * Intercept 401 responses
     */
    responseError: function(error) {

      //Not a 401 or ignoring interception?
      if (error.status !== 401 || error.config.ignore401Intercept) {
        return $q.reject(error);
      }

      //Create deferred
      var deferred = $q.defer();

      //Try to obtain a new authentication token
      Auth = Auth || $injector.get('Auth');
      Auth.refresh().then(function() {
        retryHttpRequest(error.config, deferred);
      }, function() {
        Auth.logout(true);
        deferred.reject(error);
      });

      //Return promise
      return deferred.promise;
    }
  };
});
