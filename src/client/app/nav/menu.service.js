
/**
 * Module definition and dependencies
 */
angular.module('App.Nav.Menu.Service', [])

/**
 * Simple menu service
 */
.factory('Menu', function() {
	return {
		main: [
			{
				sref: 'home',
				title: 'home'
			}
		]
	};
});
