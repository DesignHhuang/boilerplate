
/**
 * Module definition and dependencies
 */
angular.module('Common.Authentication.AuthHttpInterceptor.Service', [])

/**
 * Interceptor service
 */
.factory('AuthHttpInterceptor', function($rootScope, $q, $injector) {

	//Store services
	var Auth, $http;

	/**
	 * Helper to retry a http request
	 */
	function retryHttpRequest(config, deferred) {

		//Get http service
		$http = $http || $injector.get('$http');

		//Append new access token
		config = appendAccessToken(config);

		//Retry the request
		$http(config).then(function(response) {
			deferred.resolve(response);
		}, function(reason) {
			deferred.reject(reason);
		});
	}

	/**
	 * Helper to append the access token to the headers of a http configuration object
	 */
	function appendAccessToken(config) {

		//Get Auth service
		Auth = Auth || $injector.get('Auth');

		//Initialize headers if needed
		config.headers = config.headers || {};

		//Get access token and append to header if present
		var accessToken = Auth.getAccessToken();
		if (accessToken) {
			config.headers.Authorization = 'Bearer ' + accessToken;
		}

		//Return config object
		return config;
	}

	/**
	 * Interceptor object
	 */
	return {

		/**
		 * Append authorization header
		 */
		request: function(config) {
			return appendAccessToken(config);
		},

		/**
		 * Intercept 401 responses
		 */
		responseError: function(rejection) {

			//Not a 401 or ignoring interception?
			if (rejection.status !== 401 || (rejection.config && rejection.config.ignore401Intercept)) {
				return $q.reject(rejection);
			}

			//Create deferred
			var deferred = $q.defer();

			//Try to obtain a new authentication token
			Auth = Auth || $injector.get('Auth');
			Auth.refresh().then(function() {
				retryHttpRequest(rejection.config, deferred);
			}, function(reason) {
				Auth.logout(true);
				deferred.reject(rejection);
			});

			//Return promise
			return deferred.promise;
		}
	};
});