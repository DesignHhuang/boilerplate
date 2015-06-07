
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Secure', [
	'MyApp.Secure.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('secure', {
		url:			'/secure',
		auth:			true,
		controller:		'SecureCtrl',
		templateUrl:	'secure/secure.html'
	});
});