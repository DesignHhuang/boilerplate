
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Register.Controller', [])

/**
 * Controller
 */
.controller('UserRegisterCtrl', function(
	$scope, $state, $timeout, Error, User, Login
) {

	//New user model
	$scope.user = {};

	//Flags
	$scope.isRegistered = false;
	$scope.isSaving = false;

	/**
	 * Register
	 */
	$scope.register = function(user) {

		//Must be validated
		if ($scope.registerForm.$invalid) {
			return;
		}

		//Toggle flag
		$scope.isSaving = false;

		//Register user
		User.create(user).then(function(data) {

			//Toggle flags
			$scope.isSaving = false;
			$scope.isRegistered = true;

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

			//Handle registration errors
			if (error) {
				switch (error.code) {
					case Error.NOT_VALIDATED:
						//$scope.registerForm.email.$setValidity('exists', false);
						break;
				}
			}
		});
	};
});
