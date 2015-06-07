
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Login.oAuthRedirect', [
	'MyApp.User.Login.oAuthRedirect.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user.login.oAuthRedirect', {
		url:			'^/oAuthRedirect/:provider',
		controller:		'oAuthRedirectCtrl',
		templateUrl:	'user/login/oAuthRedirect/redirect.html'
	});
});