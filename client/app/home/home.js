
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Home', [
	'MyApp.Home.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('home', {
		url:			'/',
		controller:		'HomeCtrl',
		templateUrl:	'home/home.html'
	});
});