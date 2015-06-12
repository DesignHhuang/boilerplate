
/**
 * Module definition and dependencies
 */
angular.module('App.Mock.Token', [
	'App.Mock.Token.Repository.Service',
	'App.Mock.User.Repository.Service'
])

/**
 * Run logic
 */
.run(function(
	$httpBackend, Mock, Error, TokenRepository, UserRepository
) {

	//API paths
	var apiBasePath	= 'token';

	/**
	 * Token request
	 */
	$httpBackend.whenPOST(apiBasePath).respond(function(method, url, data, headers) {
		//See user/login
	});
});