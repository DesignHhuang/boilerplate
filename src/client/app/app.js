
/**
 * Module definition and dependencies
 */
angular.module('App', [

	//Angular & 3rd party
	'ngAnimate',
	'ngSanitize',
	'ngMessages',
	'ui.router',

	//Common modules
	'Common.Angular.ScopeExtension',

	//Core modules
	'App.Env',
	'App.Config',
	'App.Errors',
	'App.Templates',
	'App.Controller',

	//App modules
	'App.Nav',
	'App.Home'
])

/**
 * Application configuration
 */
.config(function($locationProvider, $urlRouterProvider) {

	//Enable HTML 5 mode browsing and set default route
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
})

/**
 * Run logic
 */
.run(function($rootScope, App) {
	$rootScope.App = App;
});
