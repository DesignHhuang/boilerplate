
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Config', [
	'MyApp.User.Service'
])

/**
 * Business logic configuration
 */
.config(function(
	UserProvider
) {

	//User default data
	UserProvider.setDefaultData({
		name: 'Guest'
	});
});
