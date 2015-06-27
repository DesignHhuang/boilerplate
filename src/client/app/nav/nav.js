
/**
 * Module definition and dependencies
 */
angular.module('App.Nav', [
  'App.Nav.Controller',
  'App.Nav.Menu.Service'
])

/**
 * Run logic
 */
.run(function($rootScope, Menu) {
  $rootScope.Menu = Menu;
});
