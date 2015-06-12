
/**
 * Module definition and dependencies
 */
angular.module('App.Secure', [
	'App.Secure.Controller'
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