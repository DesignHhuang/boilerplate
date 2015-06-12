
/**
 * Module definition and dependencies
 */
angular.module('App.User', [
	'App.User.Profile',
	'App.User.Login',
	'App.User.Register',
	'App.User.Connect',
	'App.User.Service',
	'App.User.UserExists.Directive'
])

/**
 * Config
 */
.config(function($stateProvider) {

	//State definition
	$stateProvider.state('user', {
		url:			'',
		abstract:		true,
		template:		'<ui-view/>'
	});
})

/**
 * Run logic
 */
.run(function($rootScope, User, Auth) {

	//Expose user service in root scope
	$rootScope.User = User;
});
