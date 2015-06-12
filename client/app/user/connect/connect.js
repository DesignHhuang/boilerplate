
/**
 * Module definition and dependencies
 */
angular.module('App.User.Connect', [
	'App.User.Connect.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user.connect', {
		url:			'/connect',
		controller:		'UserConnectCtrl',
		templateUrl:	'user/connect/connect.html',
		params: {
			provider: '',
			user: null
		}
	});
});