
/**
 * Module definition and dependencies
 */
angular.module('App.Errors.HttpInterceptor.Service', [])

/**
 * Config
 */
.config(function($httpProvider) {
  $httpProvider.interceptors.push('ErrorsHttpInterceptor');
})

/**
 * Interceptor service
 */
.factory('ErrorsHttpInterceptor', function($rootScope, $q, Logger) {

  /**
   * Determine if this is a HTML template request
   */
  function isTemplateRequest(request) {
    return (request && request.url.indexOf('.html') !== -1);
  }

  /**
   * Interceptor object
   */
  return {

    /**
     * Log all requests
     */
    request: function(request) {

      //Log non-template requests
      if (!isTemplateRequest(request)) {
        Logger.info(request.method, request.url, '...');
      }

      //Return for further handling
      return request;
    },

    /**
     * Log successful responses
     */
    response: function(response) {

      //Get request
      var request = response.config;

      //Log non template request responses
      if (request && !isTemplateRequest(request)) {
        Logger.log(request.method, request.url, response.status, response.statusText);
        Logger.debug(response.data);
      }

      //Return response
      return response;
    },

    /**
     * Log and intercept error responses
     */
    responseError: function(response) {

      //Get request
      var request = response.config;

      //Log non template request responses
      if (request && !isTemplateRequest(request)) {
        Logger.warn(request.method, request.url, response.status, response.statusText);
        Logger.debug(response.data);
      }

      //Handle server errors
      if (response.status >= 500 && response.status <= 599) {
        //$rootScope.$broadcast('error.httpServerError', response.data);
      }

      //Handle client errors
      if (response.status >= 400 && response.status <= 499) {
        //$rootScope.$broadcast('error.httpClientError', response.data);
      }

      //Return rejection
      return $q.reject(response);
    }
  };
});
