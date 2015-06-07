
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Register', [
	'MyApp.User.Register.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user.register', {
		url:			'/register',
		controller:		'UserRegisterCtrl',
		templateUrl:	'user/register/register.html'
	});
});