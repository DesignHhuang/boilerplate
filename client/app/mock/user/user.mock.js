
/**
 * Module definition and dependencies
 */
angular.module('App.Mock.User', [
	'App.Mock.User.Repository.Service',
	'App.Mock.Token.Repository.Service'
])

/**
 * Run logic
 */
.run(function(
	$httpBackend, Mock, Error, UserRepository, TokenRepository
) {

	//API paths
	var apiBasePath	= 'user';

	//API regexes
	var apiRegexQuery = Mock.queryRegex(apiBasePath);

	/**
	 * Query users
	 */
	$httpBackend.whenGET(apiRegexQuery).respond(function(method, url, data, headers) {

		//Get user from headers
		var user = TokenRepository.authUser(headers);

		//Check if authenticated
		if (!user) {
			return [401, Mock.errorData(Error.NOT_AUTHENTICATED), {}];
		}

		//Check if authorized
		if (!user.isAdmin) {
			return [403, Mock.errorData(Error.NOT_AUTHORIZED), {}];
		}

		//Get data
		var params = {isAdmin: false};

		//Get users and return
		var users = UserRepository.query(params);
		return [200, users, {}];
	});

	/**
	 * Fetch user data
	 */
	$httpBackend.whenGET(apiBasePath + '/me').respond(function(method, url, data, headers) {

		//Get user from headers
		var user = TokenRepository.authUser(headers);

		//Not authenticated? Send 401 response
		if (!user) {
			return [401, Mock.errorData(Error.NOT_AUTHENTICATED), {}];
		}

		//Return user
		return [200, user, {}];
	});

	/**
	 * Create a new user
	 */
	$httpBackend.whenPOST(apiBasePath).respond(function(method, url, data, headers) {

		//Get data and create user
		var params = angular.fromJson(data),
			user = UserRepository.create(params);

		//Not created?
		if (!user) {
			return [422, {}, {}];
		}

		//Generate token for user
		user.token = TokenRepository.generateToken(user);

		//Created ok
		return [201, user, {}];
	});

	/**
	 * Update user details
	 */
	$httpBackend.whenPUT(apiBasePath).respond(function(method, url, data, headers) {

		//Get user from headers
		var user = TokenRepository.authUser(headers);

		//Check if authenticated
		if (!user) {
			return [401, {}, {}];
		}

		//Get data and try to update
		var params = angular.fromJson(data);
		user = UserRepository.updateById(user.id, params);

		//Not updated?
		if (!user) {
			return [422, {}, {}];
		}

		//Updated ok
		return [200, user, {}];
	});

	/**
	 * Check if a user exists for given data
	 */
	$httpBackend.whenPOST(apiBasePath + '/exists').respond(function(method, url, data, headers) {

		//Get data and check if user exists
		var params = angular.fromJson(data),
			user = UserRepository.findByParams(params);

		//Return exists status
		return [200, {exists: !!user}, {}];
	});

	/**
	 * Check user e-mail address verification
	 */
	$httpBackend.whenPOST(apiBasePath + '/verify').respond(function(method, url, data, headers) {

		//Get data
		var params = angular.fromJson(data),
			verified = UserRepository.verifyEmailToken(params.token);

		//Return response
		return [200, {verified: verified}, {}];
	});

	/**
	 * Login user
	 */
	$httpBackend.whenPOST(apiBasePath + '/login').respond(function(method, url, data, headers) {

		//Data comes as a parametrized string
		data = Mock.paramsFromUrl(data, '');

		//Initialize user
		var user;

		//Check grant type
		switch (data.grant_type) {

			//Password login
			case 'password':

				//Validate data
				if (!data.email || !data.password) {
					return [400, Mock.errorData(Error.INVALID_DATA), {}];
				}

				//Find user by credentials
				user = UserRepository.findByCredentials(data);

				//If not found, return error
				if (!user) {
					return [401, Mock.errorData(Error.INVALID_CREDENTIALS), {}];
				}
				break;

			//External token
			case 'external_token':

				//Validate data
				if (!data.external_provider || !data.external_id || !data.email) {
					return [400, Mock.errorData(Error.INVALID_DATA), {}];
				}

				//Find by external provider/ID combo
				user = UserRepository.findByProvider(data.external_provider, data.external_id);

				//If not found, try to find by e-mail
				if (!user) {
					user = UserRepository.findByEmail(data.email);

					//If found, update provider details
					if (user) {
						user = UserRepository.updateById(user.id, {
							externalProvider: data.external_provider,
							externalId: data.external_id
						});
					}
				}

				//If still not found, return error
				if (!user) {
					return [401, Mock.errorData(Error.NOT_ASSOCIATED), {}];
				}
				break;

			//Refresh token
			case 'refresh_token':

				//Try to find the user by refresh token (stored encrypted in cookie)
				//TODO: read from cookie
				user = null;

				//Not found?
				if (!user) {
					return [401, Mock.errorData(Error.NOT_AUTHENTICATED), {}];
				}
				break;

			//Unknown/invalid grant type
			default:
				return [400, Mock.errorData(Error.INVALID_GRANT_TYPE), {}];
		}

		//Suspended?
		if (!user.isActive) {
			return [401, Mock.errorData(Error.NOT_ACTIVE), {}];
		}

		//Generate token for user
		var token = TokenRepository.generateToken(user);

		//No token?
		if (!token) {
			return [400, Mock.errorData(Error.INVALID_TOKEN), {}];
		}

		//Return token
		return [200, token, {}];
	});
});