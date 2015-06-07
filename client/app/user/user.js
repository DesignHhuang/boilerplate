
/**
 * Module definition and dependencies
 */
angular.module('MyApp.User', [
	'MyApp.User.Profile',
	'MyApp.User.Login',
	'MyApp.User.Register',
	'MyApp.User.Connect',
	'MyApp.User.Service',
	'MyApp.User.UserExists.Directive'
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
