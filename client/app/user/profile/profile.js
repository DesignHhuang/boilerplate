
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User.Profile', [
	'MyApp.User.Profile.Controller'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user.profile', {
		url:			'/profile',
		auth:			true,
		controller:		'UserProfileCtrl',
		templateUrl:	'user/profile/profile.html'
	});
});