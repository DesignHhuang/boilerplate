
/**
 * Module definition and dependencies
 */
angular.module('App.User.Login.Controller', [])

/**
 * Controller
 */
.controller('UserLoginCtrl', function(
	$scope, $state, $injector, $timeout, Error, Auth, oAuth, Login
) {

	/**
	 * Cancel login
	 */
	$scope.cancel = function() {
		Login.cancel();
	};

	/**
	 * Cancel oAuth
	 */
	$scope.cancelOAuth = function() {
		oAuth.cancel();
		$scope.oAuthStatus = '';
		$scope.oAuthError = '';
	};

	/**
	 * Validity reset for server errors
	 */
	$scope.resetValidity = function() {
		$scope.loginForm.email.$setValidity('suspended', true);
		$scope.loginForm.password.$setValidity('credentials', true);
	};

	/**
	 * Login with credentials
	 */
	$scope.loginWithCredentials = function(credentials, remember) {

		//Must be validated
		if ($scope.loginForm.$invalid) {
			return;
		}

		//Login with credentials
		Login.withCredentials(credentials, remember).then(function(authData) {

			//Redirect after a timeout, with home state as fallback state
			$timeout(function() {
				Login.redirect('home');
			}, 2000);

		}, function(error) {

			//Handle login errors
			if (error) {
				switch (error.code) {
					case Error.INVALID_CREDENTIALS:
						$scope.loginForm.password.$setValidity('credentials', false);
						break;
					case Error.USER_SUSPENDED:
						$scope.loginForm.email.$setValidity('suspended', false);
						break;
				}
			}
		});
	};

	/**
	 * Login with oAuth
	 */
	$scope.loginWithOAuth = function(provider, usePopup) {

		//Initialize oAuth scope vars
		$scope.oAuthProvider = provider;
		$scope.oAuthStatus = 'init';
		$scope.oAuthError = '';

		//Authenticate using redirection
		if (!usePopup) {
			$scope.oAuthStatus = 'redirect';
			oAuth.redirect(provider);
			return;
		}

		//Update status
		$scope.oAuthStatus = 'popup';

		//Authenticate using popup
		oAuth.popup(provider).then(function(oAuthData) {

			//Update status
			$scope.oAuthStatus = 'login';

			//Login with oAuth
			Login.withOAuth(oAuth.token(), oAuthData).then(function(authData) {

				//Success
				$scope.oAuthStatus = 'success';

				//Redirect after a timeout, with home state as fallback state
				$timeout(function() {
					Login.redirect('home');
				}, 2000);

			}, function(error) {

				//Handle errors
				switch (error.code) {

					//No user associated yet with this external account
					case Error.NOT_ASSOCIATED:

						//Set status
						$scope.oAuthStatus = 'fetch';

						//Obtain user data
						oAuth.api().me().then(function(userData) {

							//Set status
							$scope.oAuthStatus = 'connect';

							//Go to user connect page
							$timeout(function() {
								$state.go('user.connect', {
									provider: provider,
									user: userData
								});
							}, 2000);
						});
						break;

					//Any other errors can't be recovered from
					default:
						$scope.oAuthStatus = 'error';
						$scope.oAuthError = 'Could not log you in';
						break;
				}
			});
		}, function(reason) {

			//Check reason
			switch (reason) {

				//Cancelled by user
				case 'oAuth.cancelled':
				case 'oAuth.popupClosed':
					$scope.oAuthStatus = '';
					$scope.oAuthError = '';
					break;

				//Invalid provider
				case 'oAuth.invalidProvider':
					$scope.oAuthStatus = 'error';
					$scope.oAuthError = 'Invalid or unknown provider';
					break;

				//Other errors
				default:
					$scope.oAuthStatus = 'error';
					$scope.oAuthError = reason;
			}

		}, function(progress) {

			//Update status
			if (progress) {
				$scope.oAuthStatus = 'validate';
			}
		});
	};

	/*****************************************************************************
	 * Initialization
	 ***/

	//Credentials
	$scope.credentials = {};
	$scope.remember = false;

	//Set login redirect state in scope, to display various reasons for needing to login
	$scope.loginFor = Login.getPostLoginState().name;

	//Initialize oAuth scope vars
	$scope.oAuthProvider = '';
	$scope.oAuthStatus = '';
	$scope.oAuthError = '';
});