
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Errors', [])

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
})

/**
 * Error constant
 */
.constant('Error', {

	//API handling errors
	METHOD_NOT_IMPLEMENTED: 50100,
	METHOD_NOT_ALLOWED: 40500,

	//Invalid requests
	INVALID_REQUEST: 40000,
	INVALID_GRANT_TYPE: 40001,
	INVALID_TOKEN: 40002,
	INVALID_DATA: 40003,

	//Authentication errors
	NOT_AUTHENTICATED: 40100,
	NOT_ACTIVE: 40101,
	NOT_ASSOCIATED: 40102,
	INVALID_CREDENTIALS: 40105,

	//Authorization errors
	NOT_AUTHORIZED: 40300,

	//Not found errors
	NOT_FOUND: 40400,

	//Validation errors
	NOT_VALIDATED: 42200
});
