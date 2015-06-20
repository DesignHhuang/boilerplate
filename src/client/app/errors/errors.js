
/**
 * Module definition and dependencies
 */
angular.module('App.Errors', [
	'App.Errors.Constant'
])

/**
 * Configuration
 */
.config(function($provide, $httpProvider) {

	//Http interceptor
	$httpProvider.interceptors.push(['$rootScope', '$q', function($rootScope, $q) {
		return {
			responseError: function(rejection) {

				//Ignore interception?
				if (rejection.config && rejection.config.ignoreErrorIntercept) {
					return $q.reject(rejection);
				}

				//Intercept server errors
				if (rejection.status >= 500 && rejection.status < 600) {
					$rootScope.$broadcast('error.httpServerError', rejection.data);
				}

				//Intercept client errors
				if (rejection.status >= 400 && rejection.status < 500) {
					$rootScope.$broadcast('error.httpClientError', rejection.data);
				}

				//Default behavior
				return $q.reject(rejection);
			}
		};
	}]);

	//Exception handling
	$provide.decorator('$exceptionHandler', function($log, $delegate) {
    return function(exception, cause) {
    	$delegate(exception, cause);
    };
  });
});
