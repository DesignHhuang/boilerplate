
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Nav', [
	'MyApp.Nav.Controller',
	'MyApp.Nav.Menu.Service',
	'MyApp.Nav.IsActiveSref.Directive'
])

/**
 * Constant definition
 */
.run(function($rootScope, Menu) {

	//Set menu in rootscope
	$rootScope.Menu = Menu;
});
