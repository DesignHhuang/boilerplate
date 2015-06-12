
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Login.oAuthRedirect.Controller', [
	'Common.Authentication.oAuth.Service'
])

/**
 * oAuth redirect callback controller
 */
.controller('oAuthRedirectCtrl', function($scope, $state, $window, $timeout, oAuth, Login) {

	//Parse query string helper
	function parseQueryString(str) {
		var params = {}, regex = /([^&=]+)=([^&]*)/g, m;
		while ((m = regex.exec(str))) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		return params;
	}

	//Get parameters from hash fragment
	function getParametersFromHash() {
		if ($window.location.hash.indexOf('#') === 0) {
			return parseQueryString($window.location.hash.substr(1));
		}
		return {};
	}

	//Initialize oAuth scope vars
	$scope.oAuthProvider = $state.params.provider;
	$scope.oAuthUsername = '';
	$scope.oAuthStatus = 'init';
	$scope.oAuthError = '';

	//Run callback
	oAuth.callback($state.params.provider, getParametersFromHash()).then(function(oAuthData) {

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

						//Set status and username
						$scope.oAuthStatus = 'connect';
						$scope.oAuthUsername = userData.name;

						//Go to user connect page
						$timeout(function() {
							$state.go('user.connect');
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

		//Update status and set error
		$scope.oAuthStatus = 'error';
		$scope.oAuthError = reason;
	});
});
