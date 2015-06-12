
/**
 * Module definition and dependencies
 */
angular.module('Common.Authentication.Auth.Service', [
	'Common.Authentication.AuthHttpInterceptor.Service',
	'Common.Utility.Storage.Service',
	'Common.Utility.Url.Service'
])

/**
 * Config
 */
.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthHttpInterceptor');
})

/**
 * Provider definition
 */
.provider('Auth', function AuthProvider() {

	//Client identifier
	this.clientIdentifier = '';

	//Auth endpoint
	this.authEndpoint = 'user/login';

	//Refreshing of access tokens enabled?
	this.refreshEnabled = true;

	//How to store access tokens (memory / session / local / auto)
	this.storageMode = 'session';

	/**
	 * Set client identifier
	 */
	this.setClientIdentifier = function(clientIdentifier) {
		this.clientIdentifier = clientIdentifier;
		return this;
	};

	/**
	 * Set login endpoint
	 */
	this.setAuthEndpoint = function(authEndpoint) {
		this.authEndpoint = authEndpoint;
		return this;
	};

	/**
	 * Set whether or not refreshing of access tokens is al
	 */
	this.setRefreshEnabled = function(refreshEnabled) {
		this.refreshEnabled = !!refreshEnabled;
		return this;
	};

	/**
	 * Set the access token storage mode
	 */
	this.setStorageMode = function(storageMode) {
		this.storageMode = storageMode;
		return this;
	};

	/**
	 * Service getter
	 */
	this.$get = function($rootScope, $q, $http, $window, $timeout, Error, Url, Storage) {

		//Set settings in local vars
		var clientIdentifier = this.clientIdentifier,
			authEndpoint = this.authEndpoint,
			refreshEnabled = this.refreshEnabled,
			storageMode = this.storageMode;

		//Helper vars
		var refreshDeferred = null,
			rememberSession = false,
			storedAccessToken = '';

		/**
		 * Decode token payload
		 */
		function decodeTokenPayload(token) {

			//No token?
			if (!token) {
				return {};
			}

			//Split in parts
			var parts = token.split('.');
			if (parts.length !== 3) {
				return {};
			}

			//Get decoded payload
			try {
				var decoded = Url.base64Decode(parts[1]);
				return angular.fromJson(decoded);
			}
			catch (e) {
				return {};
			}
		}

		/**
		 * Prepare token data
		 */
		function prepareTokenData(data) {

			//Initialize object
			data = data || {};

			//Append client identifier
			data.clientId = clientIdentifier;

			//Convert to params (snake case)
			return Url.toQueryString(data, true);
		}

		/**
		 * Process access token
		 */
		function processAccessToken(accessToken) {

			//Object data given?
			if (angular.isObject(accessToken)) {
				accessToken = accessToken.accessToken || accessToken.access_token || '';
			}

			//No access token?
			if (!accessToken || !angular.isString(accessToken)) {
				return null;
			}

			//Store the access token
			Auth.storeAccessToken(accessToken);

			//Expose and return token payload
			return (Auth.data = decodeTokenPayload(accessToken));
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
			$rootScope.$broadcast('auth.authenticated', data);
		}

		/**
		 * Auth service
		 */
		var Auth = {

			/**
			 * Exposed data
			 */
			data: {},

			/**
			 * Initialize
			 */
			init: function() {

				//Get access token and expose token payload if present
				var accessToken = Auth.getAccessToken();
				if (accessToken) {
					Auth.data = decodeTokenPayload(accessToken);
				}

				//Otherwise, try to refresh if enabled
				else if (refreshEnabled) {
					Auth.refresh();
				}

				//Broadcast initial auth status
				$timeout(function() {
					broadcastAuthStatus({
						isAuthenticated: !!accessToken,
						isInitial: true
					});
				});
			},

			/**
			 * Get storage mode
			 */
			getStorageMode: function() {
				switch(storageMode) {
					case 'memory':
					case 'session':
					case 'local':
						return storageMode;
					case 'auto':
						return rememberSession ? 'local' : 'session';
				}
			},

			/**
			 * Get access token
			 */
			getAccessToken: function() {
				switch(storageMode) {
					case 'memory':
						return storedAccessToken;
					case 'auto':
						storageMode = rememberSession ? 'local' : 'session';
						/* falls through */
					case 'session':
					case 'local':
						return Storage.get('auth.accessToken', storageMode) || '';
					default:
						return '';
				}
			},

			/**
			 * Store access token
			 */
			storeAccessToken: function(accessToken) {
				switch(storageMode) {
					case 'memory':
						storedAccessToken = accessToken;
						return;
					case 'auto':
						storageMode = rememberSession ? 'local' : 'session';
						/* falls through */
					case 'session':
					case 'local':
						Storage.set('auth.accessToken', accessToken, storageMode);
						return;
				}
			},

			/**
			 * Clear access token
			 */
			clearAccessToken: function() {
				switch(storageMode) {
					case 'memory':
						storedAccessToken = '';
						return;
					case 'auto':
						storageMode = rememberSession ? 'local' : 'session';
						/* falls through */
					case 'session':
					case 'local':
						Storage.remove('auth.accessToken', storageMode);
						return;
				}
			},

			/**
			 * Remember the session (for auto access token storage mode)
			 */
			rememberSession: function(remember) {
				rememberSession = !!remember;
			},

			/**
			 * Consume access token obtained elsewhere
			 */
			consumeToken: function(token) {

				//Process token data
				var data = processAccessToken(token);

				//No data?
				if (data === null) {
					return $q.reject('Invalid access token');
				}

				//Broadcast auth status update
				broadcastAuthStatus({
					isAuthenticated: true
				});

				//Resolve
				return $q.when(data);
			},

			/**
			 * Do a login
			 */
			login: function(grantType, data) {

				//Create deferred
				var deferred = $q.defer();

				//Extend data
				angular.extend(data, {
					grantType: grantType
				});

				//Send request
				$http.post(authEndpoint, prepareTokenData(data), {
					ignore401Intercept: true
				}).success(function(response) {

					//Process token response
					var data = processAccessToken(response);

					//Failed?
					if (data === null) {
						Auth.logout(true);
						deferred.reject('Invalid access token');
						return;
					}

					//Broadcast auth status update
					broadcastAuthStatus({
						isAuthenticated: true,
						isUserInitiated: true
					});

					//Resolve
					deferred.resolve(data);

				}).error(function(error, status) {
					Auth.logout(true);
					deferred.reject(error);
				});

				//Return promise
				return deferred.promise;
			},

			/**
			 * Do a logout
			 */
			logout: function(isAutomatic) {

				//Check current status
				var wasAuthenticated = Auth.isAuthenticated();

				//Clear access token and exposed token payload
				Auth.clearAccessToken();
				Auth.data = {};

				//Were we authenticated? Broadcast auth status change
				if (wasAuthenticated) {
					broadcastAuthStatus({
						isAuthenticated: false,
						isUserInitiated: !isAutomatic
					});
				}
			},

			/**
			 * Refresh access token
			 */
			refresh: function() {

				//Refreshing of access tokens not enabled or no endpoint?
				if (!refreshEnabled || !authEndpoint) {
					return $q.reject('Refresh not enabled');
				}

				//Are we already refreshing? Return that promise, to prevent multiple requests
				if (refreshDeferred) {
					return refreshDeferred.promise;
				}

				//Create deferred
				refreshDeferred = $q.defer();

				//Create data (note that the refresh token is not stored in the client)
				var data = {
					grantType: 'refresh_token'
				};

				//Clear the current access token
				Auth.clearAccessToken();

				//Send request
				$http.post(authEndpoint, prepareTokenData(data), {
					ignore401Intercept: true
				}).success(function(response) {

					//Process token response
					var data = processAccessToken(response, true);

					//Failed?
					if (data === null) {
						Auth.logout(true);
						refreshDeferred.reject('Invalid access token');
						refreshDeferred = null;
						return;
					}

					//Broadcast auth status update
					broadcastAuthStatus({
						isAuthenticated: true
					});

					//Resolve deferred now
					refreshDeferred.resolve(data);
					refreshDeferred = null;

				}).error(function(error, status) {
					Auth.logout(true);
					refreshDeferred.reject(error);
					refreshDeferred = null;
				});

				//Return promise
				return refreshDeferred.promise;
			},

			/**
			 * Check if we're currently authenticated
			 */
			isAuthenticated: function() {
				return !!Auth.getAccessToken();
			},

			/**
			 * Get claims
			 */
			getClaims: function() {

				//No claims?
				if (!Auth.data || !Auth.data.claims) {
					return [];
				}

				//Not an array?
				if (!angular.isArray(Auth.data.claims)) {
					return Auth.data.claims.split(' ');
				}

				//Return
				return Auth.data.claims;
			},

			/**
			 * Has claim check
			 */
			hasClaim: function(claim, claims) {

				//Get claims if not given
				claims = claims || Auth.getClaims();

				//Not an array?
				if (!angular.isArray(claims)) {
					claims = claims.split(' ');
				}

				//Check if claim present
				return claims.indexOf(claim) !== -1;
			}
		};

		//Initialize
		Auth.init();

		/**
		 * Listen for storage events
		 */
		angular.element($window).on('storage', function() {
			$rootScope.$apply(function() {
				if (refreshEnabled && !Auth.isAuthenticated()) {
					Auth.refresh();
				}
			});
		});

		//Return
		return Auth;
	};
});
