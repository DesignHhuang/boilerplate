
/**
 * Module definition and dependencies
 */
angular.module('MyApp.Mock.Token', [
	'MyApp.Mock.Token.Repository.Service',
	'MyApp.Mock.User.Repository.Service'
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