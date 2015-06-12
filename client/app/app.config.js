
/**
 * Module definition and dependencies
 */
angular.module('App.Config', [
	'App.User.Service'
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
