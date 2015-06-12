
/**
 * Module definition and dependencies
 */
angular.module('App.User.Login.Service', [])

/**
 * Service definition
 */
.provider('Login', function LoginProvider() {

	//Login using a modal?
	this.usingModal = false;

	/**
	 * Set modal usage
	 */
	this.usingModal = function(usingModal) {
		this.usingModal = !!usingModal;
	};

	/**
	 * Service getter
	 */
	this.$get = function($q, $state, Auth) {

		//Modal usage
		var usingModal = this.usingModal, modalInstance;

		//Post login redirect state name and params
		var postLoginState = '',
			postLoginParams = {};

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

				//Not using modal?
				if (!usingModal) {
					$state.go('user.login');
					return;
				}

				//Open modal
				/*modalInstance = $modal.open({
					templateUrl: 'user/login/loginModal.html',
					controller: 'UserLoginCtrl'
				});*/
			},

			/**
			 * Cancel login
			 */
			cancel: function() {
				if (usingModal && modalInstance) {
					modalInstance.close();
				}
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

					//Close modal if needed
					if (usingModal && modalInstance) {
						modalInstance.close();
					}

					//Resolve promise
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

					//Close modal if needed
					if (usingModal && modalInstance) {
						modalInstance.close();
					}

					//Resolve promise
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
			 * Login with external token
			 */
			withExternalToken: function(externalToken, data, remember) {

				//Create deferred
				var deferred = $q.defer();

				//Add token to data
				data = angular.extend(data || {}, {
					externalToken: externalToken
				});

				//Attempt a login, redirect to the home state by default
				Auth.rememberSession(remember);
				Auth.login('external_token', data).then(function(data) {

					//Close modal if needed
					if (usingModal && modalInstance) {
						modalInstance.close();
					}

					//Resolve promise
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
			 * Login with local token obtained elsewhere
			 */
			withLocalToken: function(token, remember) {

				//Create deferred
				var deferred = $q.defer();

				//Consume token
				Auth.rememberSession(remember);
				Auth.consumeToken(token).then(function(data) {

					//Close modal if needed
					if (usingModal && modalInstance) {
						modalInstance.close();
					}

					//Resolve promise
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
						return;
					}

					//Use fallback
					postLoginState = fallbackState;
					postLoginParams = fallbackParams || {};
				}

				//Redirect
				$state.go(postLoginState, postLoginParams);

				//Clear remembered state
				postLoginState = '';
				postLoginParams = {};
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
