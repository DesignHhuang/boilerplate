
/**
 * See: https://developers.google.com/identity/protocols/OAuth2#clientside
 * 		https://developers.google.com/identity/protocols/OAuth2UserAgent
 */

/**
 * Module definition and dependencies
 */
angular.module('Common.Authentication.oAuth.Google.Service', [
	'Common.Authentication.oAuth.Service',
	'Common.Utility.Url.Service'
])

/**
 * Provider definition
 */
.provider('oAuthGoogle', function oAuthGoogleProvider() {

	//Configuration defaults
	this.popupCallbackUrl = '';
	this.redirectCallbackUrl = '';
	this.clientId = '';
	this.scopes = ['email'];
	this.defaultParams = {};

	/**
	 * Set the popup callback URL
	 */
	this.setPopupCallbackUrl = function(callbackUrl) {
		this.popupCallbackUrl = callbackUrl;
	};

	/**
	 * Set the redirect callback URL
	 */
	this.setRedirectCallbackUrl = function(callbackUrl) {
		this.redirectCallbackUrl = callbackUrl;
	};

	/**
	 * Set client ID
	 */
	this.setClientId = function(clientId) {
		this.clientId = clientId;
		return this;
	};

	/**
	 * Set scopes
	 */
	this.setScopes = function(scopes) {
		this.scopes = scopes;
		return this;
	};

	/**
	 * Add a scope
	 */
	this.addScope = function(scope) {
		this.scopes.push(scope);
		return this;
	};

	/**
	 * Set default params
	 */
	this.setDefaultParams = function(defaultParams) {
		this.defaultParams = defaultParams;
		return this;
	};

	/**
	 * Service getter
	 */
	this.$get = function($q, $http, $location, Url) {

		//Set local vars
		var popupCallbackUrl = this.popupCallbackUrl,
			redirectCallbackUrl = this.redirectCallbackUrl,
			clientId = this.clientId,
			scopes = this.scopes,
			defaultParams = this.defaultParams;

		//Stored data
		var storedAccessToken = '',
			storedOAuthData = {};

		/**
		 * Helper to normalize user data
		 */
		function normalizeUserData(data) {
			return {
				externalId: data.id,
				name: data.displayName,
				email: data.emails[0] ? data.emails[0].value : '',
				raw: data
			};
		}

		/**
		 * Helper to normalize oAuth data
		 */
		function normalizeOAuthData(data) {
			return {
				externalProvider: 'Google',
				externalId: data.user_id,
				email: data.email,
				isEmailVerified: data.verified_email,
				raw: data
			};
		}

		/**
		 * Public provider interface
		 */
		var oAuthGoogleInterface = {

			/**
			 * Query user data
			 */
			me: function() {

				//Must have access token
				if (!storedAccessToken) {
					return $q.reject('No stored access token present');
				}

				//Create deferred
				var deferred = $q.defer();

				//Do request
				$http.get('https://www.googleapis.com/plus/v1/people/me', {
					params: {access_token: storedAccessToken}
				}).success(function(data) {

					//Normalize data and resolve
					data = normalizeUserData(data);
					deferred.resolve(data);

				}).error(function(reason) {
					deferred.reject(reason);
				});

				//Return promise
				return deferred.promise;
			}
		};

		/**
		 * Class function
		 */
		var oAuthGoogle = {

			/**
			 * Get the provider name
			 */
			getName: function() {
				return 'Google';
			},

			/**
			 * Get the stored oAuth data
			 */
			getOAuthData: function() {
				return angular.copy(storedOAuthData);
			},

			/**
			 * Set access token once verified
			 */
			setAccessToken: function(accessToken) {
				storedAccessToken = accessToken;
			},

			/**
			 * Get access token
			 */
			getAccessToken: function() {
				return storedAccessToken;
			},

			/**
			 * Get the auth URL for this provider
			 */
			getAuthUrl: function(params, isPopup, CSRFToken) {

				//Build params string
				params = angular.extend({
					response_type: 'token',
					approval_prompt: 'auto',
					login_hint: '',
					client_id: clientId,
					redirect_uri: isPopup ? popupCallbackUrl : redirectCallbackUrl,
					scope: scopes.join(' '),
					state: CSRFToken || ''
				}, defaultParams, params || {});
				params = Url.toQueryString(params, true);

				//Return URL
				return 'https://accounts.google.com/o/oauth2/auth?' + params;
			},

			/**
			 * Callback
			 */
			callback: function(params, CSRFToken) {

				//No access token?
				if (!params.access_token) {
					return $q.reject('Missing or empty access token');
				}

				//Verify CSRF token if needed
				if (CSRFToken && (!params.state || params.state !== CSRFToken)) {
					return $q.reject('Missing or invalid CSRF token');
				}

				//Create deferred
				var deferred = $q.defer();

				//Do request
				$http.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
					params: {access_token: params.access_token}
				}).success(function(data) {

					//Verify audience
					if (data.audience !== clientId) {
						deferred.reject('Invalid audience');
						return;
					}

					//Store access token and normalized oAuth data
					storedAccessToken = params.access_token;
					storedOAuthData = normalizeOAuthData(data);

					//Resolve
					deferred.resolve(storedOAuthData);

				}).error(function(reason) {
					deferred.reject(reason);
				});

				//Return promise
				return deferred.promise;
			},

			/**
			 * Get public API interface
			 */
			getInterface: function() {
				return oAuthGoogleInterface;
			}
		};

		//Return
		return oAuthGoogle;
	};
});
