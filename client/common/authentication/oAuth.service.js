
/**
 * Module definition and dependencies
 */
angular.module('Common.Authentication.oAuth.Service', [
	'Common.Utility.Storage.Service'
])

/**
 * Provider definition
 */
.provider('oAuth', function oAuthProvider() {

	/**
	 * Service getter
	 */
	this.$get = function($q, $injector, $rootScope, $window, $location, Storage) {

		//Crypto object and generated CSRF token
		var Crypto = $window.crypto || $window.msCrypto, CSRFToken;

		//Currently active provider
		var oAuthProvider = null;

		//Cancellation handler
		var cancelHandler = null;

		/**
		 * Helper to generate a random (ranged) integer
		 */
		function randomInt(min, max) {

			//Use crypto object if available
			if (Crypto) {

				//Fill array with random number
				var byteArray = new Uint8Array(1);
				Crypto.getRandomValues(byteArray);

				//Define range
				var range = max - min + 1,
					maxRange = 256;

				//Validate
				if (byteArray[0] >= Math.floor(maxRange / range) * range) {
					return randomInt(min, max);
				}

				//Return
				return min + (byteArray[0] % range);
			}

			//Use JS random generator
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		/**
		 * Helper to generate a random char
		 */
		function randomChar() {

			//Create random int and char
			var rInt = randomInt(48, 122),
				rChar = String.fromCharCode(rInt),
				regex = /[A-Za-z0-9]/;

			//Test for valid chars
			if (!regex.test(rChar)) {
				return randomChar();
			}

			//Return the char
			return rChar;
		}

		/**
		 * Helper to format popup options
		 */
		function formatPopupOptions(options) {
			var pairs = [];
			angular.forEach(options, function(value, key) {
				if (value || value === 0) {
					value = value === true ? 'yes' : value;
					pairs.push(key + '=' + value);
				}
			});
			return pairs.join(',');
		}

		/**
		 * Generate a cryptographically strong random state (CSRF token)
		 */
		function generateCSRFToken() {

			//Generate new CSRF token
			var newCSRFToken = '';
			for (var i = 0; i < 32; i++) {
				newCSRFToken += randomChar();
			}

			//Remember and return
			return CSRFToken = newCSRFToken;
		}

		/**
		 * Get provider service
		 */
		function getProviderService(provider) {

			//No specific provider specified?
			if (!provider) {
				return null;
			}

			//Fix provider name
			provider = provider[0].toUpperCase() + provider.substr(1);

			//Get the actual oAuth provider service
			try {
				return $injector.get('oAuth' + provider);
			}
			catch (e) {
				return null;
			}
		}

		/**
		 * Mock API interface
		 */
		var mockInterface = {
			me: function() {
				return $q.reject('No provider present');
			}
		};

		/**
		 * Public interface
		 */
		var oAuth = {

			/**
			 * Get the provider name
			 */
			provider: function() {
				if (oAuthProvider) {
					return oAuthProvider.getName();
				}
				return '';
			},

			/**
			 * Get the oAuth access token from the provider
			 */
			token: function() {
				if (oAuthProvider) {
					return oAuthProvider.getAccessToken();
				}
				return '';
			},

			/**
			 * Get the oAuth data from the provider
			 */
			data: function() {
				if (oAuthProvider) {
					return oAuthProvider.getOAuthData();
				}
				return {};
			},

			/**
			 * Get provider API interface
			 */
			api: function() {
				if (oAuthProvider) {
					return oAuthProvider.getInterface();
				}
				return mockInterface;
			},

			/**
			 * Authorize with a popup
			 */
			popup: function(provider, params, popupOptions) {

				//Get and validate provider service
				oAuthProvider = getProviderService(provider);
				if (!oAuthProvider) {
					return $q.reject('oAuth.invalidProvider');
				}

				//Extend popup options
				popupOptions = angular.extend({
					width: 450,
					height: 550,
					resizable: true,
					scrollbars: false,
					toolbar: false,
					menubar: false,
					status: true
				}, popupOptions || {});

				//Obtain auth URL from provider and create deferred
				var authUrl = oAuthProvider.getAuthUrl(params, true, generateCSRFToken()),
					deferred = $q.defer(), gotCallback = false;

				//Bind event listener on window for popup
				$window.$oAuthPopupCallback = function(params) {

					//Notify of popup authentication progress
					//and mark as gotten callback
					deferred.notify(true);
					gotCallback = true;

					//Run provider specific callback
					oAuthProvider.callback(params, CSRFToken).then(function(data) {

						//Delete listener and resolve promise
						delete $window.$oAuthPopupCallback;
						deferred.resolve(data);

					}, function(reason) {
						deferred.reject(reason);
					});
				};

				//Open popup
				var popup = $window.open(authUrl, 'oAuth ' + provider, formatPopupOptions(popupOptions));

				//Check for window being closed
				var interval = $window.setInterval(function() {
					try {
						if (popup == null || popup.closed) {
							$window.clearInterval(interval);
							if (!gotCallback) {
								deferred.reject('oAuth.popupClosed');
							}
						}
					}
					catch (e) {}
				}, 500);

				//Set cancel handler
				cancelHandler = function() {

					//Clear interval
					if (interval) {
						$window.clearInterval(interval);
					}

					//Close popup
					if (popup && !popup.closed)	{
						popup.close();
					}

					//Reject deferred
					deferred.reject('oAuth.cancelled');

					//Clear cancel handler
					cancelHandler = null;
				};

				//Return promise
				return deferred.promise;
			},

			/**
			 * Authorize with redirection
			 */
			redirect: function(provider, params) {

				//Get and validate provider service
				oAuthProvider = getProviderService(provider);
				if (!oAuthProvider) {
					return $q.reject('Invalid oAuth provider ' + provider);
				}

				//Obtain auth URL from provider
				var authUrl = oAuthProvider.getAuthUrl(params, false, generateCSRFToken());

				//Redirect
				$window.location.href = authUrl;
			},

			/**
			 * Redirection callback handler
			 */
			callback: function(provider, params) {

				//Get and validate provider service
				oAuthProvider = getProviderService(provider);
				if (!oAuthProvider) {
					return $q.reject('Invalid oAuth provider ' + provider);
				}

				//Create deferred
				var deferred = $q.defer();

				//Run provider callback
				oAuthProvider.callback(params).then(function(data) {
					deferred.resolve(data);
				}, function(reason) {
					deferred.reject(reason);
				});

				//Return promise
				return deferred.promise;
			},

			/**
			 * Cancel
			 */
			cancel: function() {
				(cancelHandler || angular.noop)();
			}
		};

		//Return
		return oAuth;
	};
});