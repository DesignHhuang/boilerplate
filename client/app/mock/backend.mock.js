
/**
 * Module definition and dependencies
 */
angular.module('App.Mock.Backend', [

	//Use the E2E implementation of $httpBackend
	'ngMockE2E',

	//Mock helper service and repository
	'App.Mock.Service',
	'App.Mock.Repository.Service',

	//Specific mock modules
	'App.Mock.Token',
	'App.Mock.User'
])

/**
 * Configuration
 */
.config(function($provide, $httpProvider) {

	/**
	 * Simulate a network delay for mock backend requests
	 */
	$provide.decorator('$httpBackend', function($delegate) {
		var proxy = function(method, url, data, callback, headers) {
			var interceptor = function() {
				var _this = this,
					_arguments = arguments;
				setTimeout(function() {
					callback.apply(_this, _arguments);
				}, 750);
			};
			return $delegate.call(this, method, url, data, interceptor, headers);
		};
		for (var key in $delegate) {
			if ($delegate.hasOwnProperty(key)) {
				proxy[key] = $delegate[key];
			}
		}
		return proxy;
	});

	/**
	 * Http interceptor to output mock requests/responses in console
	 */
	$httpProvider.interceptors.push(['$q', 'App', function($q, App) {
		return {

			/**
			 * Request interceptor to strip API path prefixes
			 */
			request: function(config) {
				if (config.url.indexOf(App.api.baseUrl) !== -1) {
					config.url = config.url.replace(App.api.baseUrl, '');
				}
				return config;
			},

			/**
			 * Response interceptor for logging
			 */
			response: function(response) {

				//Skip HTML template requests
				if (!response.config || response.config.url.indexOf('.html') > 0) {
					return response;
				}

				//Log to console
				console.info(response.config.method, response.config.url);
				console.info({
					params: response.config.params,
					data: (response.config.data && response.config.data.toJSON) ? response.config.data.toJSON() : response.config.data,
					headers: response.config.headers,
					status: response.status,
					response: response.data
				});

				//Return response
				return response;
			},

			/**
			 * Response error interceptor for logging
			 */
			responseError: function(rejection) {

				//Log to console
				if (rejection.config) {
					console.info(rejection.config.method, rejection.config.url);
					console.info({
						params: rejection.config.params,
						data: (rejection.config.data && rejection.config.data.toJSON) ? rejection.config.data.toJSON() : rejection.config.data,
						headers: rejection.config.headers,
						status: rejection.status,
						response: rejection.data
					});
				}

				//Reject
				return $q.reject(rejection);
			}
		};
	}]);
})

/**
 * Run logic
 */
.run(function(
	$httpBackend, $location, TokenRepository, UserRepository
) {

	/**
	 * Passthrough for external sites (http has been stripped off for local API requests by interceptor)
	 */
	$httpBackend.whenGET(/^http/).passThrough();
	$httpBackend.whenPOST(/^http/).passThrough();
	$httpBackend.whenPUT(/^http/).passThrough();
	$httpBackend.whenDELETE(/^http/).passThrough();

	/**
	 * Refresh mock data
	 */
	if (angular.isDefined($location.search().refresh)) {
		$location.search({});

		//Refresh items
		TokenRepository.refreshItems();
		UserRepository.refreshItems();
	}
});
