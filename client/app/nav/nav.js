
/**
 * Module definition and dependencies
 */
angular.module('App.Nav', [
	'App.Nav.Controller',
	'App.Nav.Menu.Service',
	'App.Nav.IsActiveSref.Directive'
])

/**
 * Constant definition
 */
.run(function($rootScope, Menu) {

	//Set menu in rootscope
	$rootScope.Menu = Menu;
});
