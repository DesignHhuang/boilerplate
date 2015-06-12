
/**
 * Module definition and dependencies
 */
angular.module('App.Nav.Menu.Service', [])

/**
 * Factory definition
 */
.factory('Menu', function() {
	return {

		//Main menu items
		main: [
			{
				sref: "home",
				title: "Home"
			},
			{
				sref: "secure",
				title: "Secure page"
			}
		]
	};
});