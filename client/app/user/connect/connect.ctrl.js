
/**
 * Module definition and dependencies
 */
angular.module('App.User.Connect.Controller', [])

/**
 * Controller
 */
.controller('UserConnectCtrl', function(
	$scope, $state, $timeout, Error, User, Login, oAuth
) {

	//Must have valid provider and user data
	if (!$state.params.provider || !$state.params.user || ($state.params.provider !== oAuth.provider())) {
		$state.go('home');
		return;
	}

	//Set oAuth provider and user data in scope
	$scope.oAuthProvider = $state.params.provider;
	$scope.user = $state.params.user;

	/**
	 * Connect
	 */
	$scope.connect = function(user) {

		//Must be validated
		if ($scope.connectForm.$invalid) {
			return;
		}

		//Get oAuth data
		var oAuthData = oAuth.data();
		delete oAuthData.raw;

		//Extend user data with oAuth data
		user = angular.extend(oAuthData, user);

		//Toggle flag
		$scope.isSaving = false;

		//Connect user
		User.create(user).then(function(data) {

			//Toggle flags
			$scope.isSaving = false;
			$scope.isConnected = true;

			//Token present?
			if (data.token) {

				//Try to login with token
				Login.withLocalToken(data.token).then(function() {

					//Redirect
					$timeout(function() {
						Login.redirect('home');
					}, 2000);

				}, function(reason) {

					//Prompt to login manually
					$timeout(function() {
						$scope.doLogin();
					}, 2000);
				});
				return;
			}

			//Prompt to login
			$timeout(function() {
				$scope.doLogin();
			}, 2000);

		}, function(error) {

			//Toggle flag
			$scope.isSaving = false;

			//Handle errors
			if (error) {
				switch (error.code) {
					case Error.NOT_VALIDATED:

						break;
				}
			}
		});
	};
});
